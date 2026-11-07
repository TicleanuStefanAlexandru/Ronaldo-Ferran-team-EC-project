using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Controllers;

[Authorize]
public class WishlistController : Controller
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public WishlistController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var items = await _context.WishlistItems
            .Include(w => w.Car)
            .ThenInclude(c => c!.Images)
            .Where(w => w.UserId == user.Id)
            .OrderByDescending(w => w.AddedAt)
            .ToListAsync();

        return View(items);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Toggle(string vin)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var existing = await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == user.Id && w.CarVin == vin);

        bool isAdded;
        if (existing != null)
        {
            _context.WishlistItems.Remove(existing);
            isAdded = false;
        }
        else
        {
            _context.WishlistItems.Add(new WishlistItem
            {
                UserId = user.Id,
                CarVin = vin,
                AddedAt = DateTime.UtcNow
            });
            isAdded = true;
        }

        await _context.SaveChangesAsync();

        if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
        {
            return Json(new { success = true, isWishlisted = isAdded });
        }

        return RedirectToAction(nameof(Index));
    }
}
