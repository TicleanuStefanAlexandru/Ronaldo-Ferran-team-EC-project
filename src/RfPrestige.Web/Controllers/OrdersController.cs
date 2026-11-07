using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Controllers;

[Authorize]
public class OrdersController : Controller
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public OrdersController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> History()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var orders = await _context.Orders
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .ThenInclude(i => i.Car)
            .ThenInclude(c => c!.Images)
            .Where(o => o.UserId == user.Id)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return View(orders);
    }
}
