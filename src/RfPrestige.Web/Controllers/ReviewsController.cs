using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Controllers;

public class ReviewsController : Controller
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReviewsController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var reviews = await _context.SiteReviews
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        ViewData["AverageRating"] = reviews.Count > 0 ? reviews.Average(r => r.Rating) : 5.0;
        ViewData["TotalReviews"] = reviews.Count;

        return View(reviews);
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(int rating, string comment)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        if (rating < 1 || rating > 5 || string.IsNullOrWhiteSpace(comment))
        {
            TempData["ErrorMessage"] = "Please provide a valid rating (1-5) and comment.";
            return RedirectToAction(nameof(Index));
        }

        var review = new SiteReview
        {
            UserId = user.Id,
            Rating = rating,
            Comment = comment.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.SiteReviews.Add(review);
        await _context.SaveChangesAsync();

        TempData["SuccessMessage"] = "Thank you! Your review has been submitted.";
        return RedirectToAction(nameof(Index));
    }
}
