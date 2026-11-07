using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;
using RfPrestige.Web.Models.ViewModels;
using RfPrestige.Web.Services;
using Stripe;
using Stripe.Checkout;

namespace RfPrestige.Web.Controllers;

[Authorize]
public class CheckoutController : Controller
{
    private readonly AppDbContext _context;
    private readonly CartService _cartService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public CheckoutController(
        AppDbContext context,
        CartService cartService,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _context = context;
        _cartService = cartService;
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var cart = await _cartService.GetCartAsync();
        if (cart.Items.Count == 0)
        {
            return RedirectToAction("Index", "Cart");
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var savedAddresses = await _context.Addresses
            .Where(a => a.UserId == user.Id)
            .OrderByDescending(a => a.IsDefault)
            .ToListAsync();

        var defaultAddress = savedAddresses.FirstOrDefault(a => a.IsDefault) ?? savedAddresses.FirstOrDefault();

        var model = new CheckoutViewModel
        {
            Cart = cart,
            SavedAddresses = savedAddresses,
            Form = new CheckoutInputModel
            {
                RecipientName = $"{user.FirstName} {user.LastName}".Trim(),
                SelectedAddressId = defaultAddress?.Id,
                DeliveryOption = cart.DeliveryOption
            }
        };

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ProcessCheckout(CheckoutInputModel form)
    {
        var cart = await _cartService.GetCartAsync();
        if (cart.Items.Count == 0)
        {
            return RedirectToAction("Index", "Cart");
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        // 1. Stock Check (A7)
        var carVins = cart.Items.Select(i => i.CarVin).ToList();
        var carsInDb = await _context.Cars
            .Where(c => carVins.Contains(c.Vin))
            .ToListAsync();

        foreach (var car in carsInDb)
        {
            if (!car.IsAvailable || car.StockQuantity <= 0)
            {
                ModelState.AddModelError(string.Empty,
                    $"The vehicle {car.Make} {car.Model} (VIN: {car.Vin}) is no longer available in stock.");
            }
        }

        if (!ModelState.IsValid)
        {
            var savedAddresses = await _context.Addresses
                .Where(a => a.UserId == user.Id)
                .OrderByDescending(a => a.IsDefault)
                .ToListAsync();

            return View("Index", new CheckoutViewModel
            {
                Cart = cart,
                SavedAddresses = savedAddresses,
                Form = form
            });
        }

        // 2. Shipping Address Resolution
        int? shippingAddressId = null;
        if (form.DeliveryOption == 1) // Enclosed Trailer Delivery
        {
            if (form.SelectedAddressId.HasValue && form.SelectedAddressId.Value > 0)
            {
                var existing = await _context.Addresses
                    .FirstOrDefaultAsync(a => a.Id == form.SelectedAddressId.Value && a.UserId == user.Id);
                if (existing != null)
                {
                    shippingAddressId = existing.Id;
                }
            }
            else if (!string.IsNullOrWhiteSpace(form.Street) && !string.IsNullOrWhiteSpace(form.City))
            {
                var newAddr = new Models.Entities.Address
                {
                    UserId = user.Id,
                    Street = form.Street,
                    City = form.City,
                    County = form.County ?? string.Empty,
                    PostalCode = form.PostalCode ?? "010001",
                    Country = form.Country,
                    IsDefault = false
                };
                _context.Addresses.Add(newAddr);
                await _context.SaveChangesAsync();
                shippingAddressId = newAddr.Id;
            }
        }

        // 3. Create Pending Order
        var order = new Order
        {
            UserId = user.Id,
            ShippingAddressId = shippingAddressId,
            DeliveryOption = form.DeliveryOption,
            TotalAmount = cart.Total,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var item in cart.Items)
        {
            order.Items.Add(new OrderItem
            {
                CarVin = item.CarVin,
                UnitPrice = item.Price
            });
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // 4. Stripe Sandbox Payment (A6)
        var stripeSecret = _configuration["Stripe:SecretKey"];
        var isRealStripeConfigured = !string.IsNullOrEmpty(stripeSecret) && !stripeSecret.Contains("placeholder");

        if (isRealStripeConfigured)
        {
            var domain = $"{Request.Scheme}://{Request.Host}";
            var lineItems = new List<SessionLineItemOptions>();

            foreach (var item in cart.Items)
            {
                lineItems.Add(new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(item.Price * 100),
                        Currency = "eur",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"{item.Year} {item.Make} {item.Model}",
                            Description = $"VIN: {item.CarVin}"
                        }
                    },
                    Quantity = 1
                });
            }

            if (cart.DeliveryFee > 0)
            {
                lineItems.Add(new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(cart.DeliveryFee * 100),
                        Currency = "eur",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Specialized Enclosed Trailer Delivery",
                            Description = "Insured European transport"
                        }
                    },
                    Quantity = 1
                });
            }

            var options = new SessionCreateOptions
            {
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = $"{domain}/Checkout/Success?orderId={order.Id}&sessionId={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{domain}/Checkout/Cancel?orderId={order.Id}",
                Metadata = new Dictionary<string, string>
                {
                    { "OrderId", order.Id.ToString() },
                    { "UserId", user.Id }
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            order.StripePaymentIntentId = session.Id;
            await _context.SaveChangesAsync();

            return Redirect(session.Url);
        }

        // Test Sandbox Mock Page
        return RedirectToAction(nameof(StripeMock), new { orderId = order.Id });
    }

    [HttpGet]
    public async Task<IActionResult> StripeMock(int orderId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Car)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == user.Id);

        if (order == null) return NotFound();

        return View(order);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ConfirmMockPayment(int orderId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        return await ExecuteStockLockAndSuccess(orderId, "mock_stripe_tx_" + Guid.NewGuid().ToString("N")[..12]);
    }

    [HttpGet]
    public async Task<IActionResult> Success(int orderId, string? sessionId = null)
    {
        return await ExecuteStockLockAndSuccess(orderId, sessionId ?? "stripe_tx_success");
    }

    private async Task<IActionResult> ExecuteStockLockAndSuccess(int orderId, string paymentId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Car)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == user.Id);

        if (order == null) return NotFound();

        if (order.Status != OrderStatus.Paid)
        {
            // Stock Management with Concurrency (A7)
            foreach (var item in order.Items)
            {
                if (item.Car != null)
                {
                    item.Car.StockQuantity = 0;
                    item.Car.IsAvailable = false;
                }
            }

            order.Status = OrderStatus.Paid;
            order.StripePaymentIntentId = paymentId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                TempData["ErrorMessage"] = "A concurrency conflict occurred while updating vehicle inventory.";
            }

            _cartService.ClearCart();
        }

        return View("Success", order);
    }

    [HttpGet]
    public async Task<IActionResult> Cancel(int orderId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == user.Id);
        if (order != null && order.Status == OrderStatus.Pending)
        {
            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();
        }

        return View("Cancel", order);
    }
}
