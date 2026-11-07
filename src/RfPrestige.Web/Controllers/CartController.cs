using Microsoft.AspNetCore.Mvc;
using RfPrestige.Web.Services;

namespace RfPrestige.Web.Controllers;

public class CartController : Controller
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var cart = await _cartService.GetCartAsync();
        return View(cart);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Add(string vin)
    {
        if (!string.IsNullOrEmpty(vin))
        {
            _cartService.AddToCart(vin);
        }

        if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
        {
            return Json(new { success = true });
        }

        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Remove(string vin)
    {
        if (!string.IsNullOrEmpty(vin))
        {
            _cartService.RemoveFromCart(vin);
        }

        if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
        {
            return Json(new { success = true });
        }

        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult UpdateDelivery(int option)
    {
        _cartService.UpdateDeliveryOption(option);

        if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
        {
            return Json(new { success = true });
        }

        return RedirectToAction(nameof(Index));
    }
}
