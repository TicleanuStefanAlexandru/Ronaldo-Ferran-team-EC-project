using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var paidOrders = await _context.Orders
            .Where(o => o.Status == OrderStatus.Paid)
            .ToListAsync();

        ViewBag.TotalRevenue = paidOrders.Sum(o => o.TotalAmount);
        ViewBag.PaidOrdersCount = paidOrders.Count;
        ViewBag.AvailableCars = await _context.Cars.CountAsync(c => c.IsAvailable && c.StockQuantity > 0);
        ViewBag.SoldCars = await _context.Cars.CountAsync(c => !c.IsAvailable || c.StockQuantity == 0);
        ViewBag.TotalCars = await _context.Cars.CountAsync();
        ViewBag.AvgRating = await _context.SiteReviews.AnyAsync() ? await _context.SiteReviews.AverageAsync(r => r.Rating) : 5.0;

        var recentOrders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .ToListAsync();

        return View(recentOrders);
    }

    [HttpGet]
    public async Task<IActionResult> Cars()
    {
        var cars = await _context.Cars
            .Include(c => c.Images)
            .OrderBy(c => c.Make)
            .ThenBy(c => c.Model)
            .ToListAsync();

        return View(cars);
    }

    [HttpGet]
    public async Task<IActionResult> CarEdit(string? vin)
    {
        if (string.IsNullOrEmpty(vin))
        {
            return View(new Car { StockQuantity = 1, IsAvailable = true, Year = DateTime.UtcNow.Year });
        }

        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Vin == vin);

        if (car == null) return NotFound();

        return View(car);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CarSave(Car car, string? imageUrl)
    {
        if (!ModelState.IsValid)
        {
            return View("CarEdit", car);
        }

        var existing = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Vin == car.Vin);

        if (existing == null)
        {
            if (!string.IsNullOrEmpty(imageUrl))
            {
                car.Images.Add(new CarImage { CarVin = car.Vin, ImageUrl = imageUrl });
            }
            _context.Cars.Add(car);
            TempData["SuccessMessage"] = $"Vehicle {car.Make} {car.Model} added to inventory.";
        }
        else
        {
            existing.Make = car.Make;
            existing.Model = car.Model;
            existing.Year = car.Year;
            existing.Category = car.Category;
            existing.Price = car.Price;
            existing.Horsepower = car.Horsepower;
            existing.Mileage = car.Mileage;
            existing.Transmission = car.Transmission;
            existing.Fuel = car.Fuel;
            existing.EngineDescription = car.EngineDescription;
            existing.StockQuantity = car.StockQuantity;
            existing.IsAvailable = car.IsAvailable;
            existing.Description = car.Description;

            if (!string.IsNullOrEmpty(imageUrl) && !existing.Images.Any(i => i.ImageUrl == imageUrl))
            {
                existing.Images.Add(new CarImage { CarVin = existing.Vin, ImageUrl = imageUrl });
            }

            TempData["SuccessMessage"] = $"Vehicle {car.Make} {car.Model} updated successfully.";
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Cars));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CarDelete(string vin)
    {
        var car = await _context.Cars.FirstOrDefaultAsync(c => c.Vin == vin);
        if (car != null)
        {
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = $"Vehicle {car.Make} {car.Model} deleted.";
        }
        return RedirectToAction(nameof(Cars));
    }

    [HttpGet]
    public async Task<IActionResult> Orders()
    {
        var orders = await _context.Orders
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .ThenInclude(i => i.Car)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return View(orders);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, OrderStatus status)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
        if (order != null)
        {
            order.Status = status;
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = $"Order #{orderId} status updated to {status}.";
        }
        return RedirectToAction(nameof(Orders));
    }

    [HttpGet]
    public async Task<IActionResult> Reviews()
    {
        var reviews = await _context.SiteReviews
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return View(reviews);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.SiteReviews.FirstOrDefaultAsync(r => r.Id == id);
        if (review != null)
        {
            _context.SiteReviews.Remove(review);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "Review removed.";
        }
        return RedirectToAction(nameof(Reviews));
    }
}
