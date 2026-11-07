using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;
using RfPrestige.Web.Models.ViewModels;

namespace RfPrestige.Web.Controllers;

public class AccountController : Controller
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;

    public AccountController(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        AppDbContext context)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _context = context;
    }

    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return LocalRedirect(returnUrl ?? "/");
        }

        ViewData["ReturnUrl"] = returnUrl;
        return View(new LoginViewModel { ReturnUrl = returnUrl });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var result = await _signInManager.PasswordSignInAsync(
            model.Email,
            model.Password,
            model.RememberMe,
            lockoutOnFailure: false);

        if (result.Succeeded)
        {
            if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
            {
                return Redirect(model.ReturnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        ModelState.AddModelError(string.Empty, "Invalid login attempt. Please check your credentials.");
        return View(model);
    }

    [HttpGet]
    public IActionResult Register(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return LocalRedirect(returnUrl ?? "/");
        }

        ViewData["ReturnUrl"] = returnUrl;
        return View(new RegisterViewModel());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel model, string? returnUrl = null)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Role = "Customer"
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "Customer");
            await _signInManager.SignInAsync(user, isPersistent: false);

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return RedirectToAction("Index", "Home");
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Addresses()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var addresses = await _context.Addresses
            .Where(a => a.UserId == user.Id)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.Id)
            .ToListAsync();

        return View(addresses);
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SaveAddress(Address address)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        if (!ModelState.IsValid)
        {
            var addresses = await _context.Addresses
                .Where(a => a.UserId == user.Id)
                .ToListAsync();
            return View("Addresses", addresses);
        }

        address.UserId = user.Id;

        if (address.IsDefault)
        {
            var existingDefaults = await _context.Addresses
                .Where(a => a.UserId == user.Id && a.IsDefault)
                .ToListAsync();
            foreach (var d in existingDefaults)
            {
                d.IsDefault = false;
            }
        }

        if (address.Id == 0)
        {
            // If this is the only address, make it default automatically
            var count = await _context.Addresses.CountAsync(a => a.UserId == user.Id);
            if (count == 0)
            {
                address.IsDefault = true;
            }
            _context.Addresses.Add(address);
        }
        else
        {
            var existing = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == address.Id && a.UserId == user.Id);
            if (existing == null) return NotFound();

            existing.Street = address.Street;
            existing.City = address.City;
            existing.County = address.County;
            existing.PostalCode = address.PostalCode;
            existing.Country = address.Country;
            existing.IsDefault = address.IsDefault;
        }

        await _context.SaveChangesAsync();
        TempData["SuccessMessage"] = "Address saved successfully.";
        return RedirectToAction(nameof(Addresses));
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == user.Id);

        if (address != null)
        {
            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "Address deleted successfully.";
        }

        return RedirectToAction(nameof(Addresses));
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetDefaultAddress(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Challenge();

        var addresses = await _context.Addresses
            .Where(a => a.UserId == user.Id)
            .ToListAsync();

        foreach (var addr in addresses)
        {
            addr.IsDefault = (addr.Id == id);
        }

        await _context.SaveChangesAsync();
        TempData["SuccessMessage"] = "Default address updated.";
        return RedirectToAction(nameof(Addresses));
    }
}
