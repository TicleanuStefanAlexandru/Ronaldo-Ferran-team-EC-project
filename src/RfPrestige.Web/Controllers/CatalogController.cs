using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;

namespace RfPrestige.Web.Controllers;

public class CatalogController : Controller
{
    private readonly AppDbContext _context;

    public CatalogController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Index(
        string? query,
        string? category,
        decimal? minPrice,
        decimal? maxPrice,
        int? minYear,
        int? minHp,
        string? transmission,
        string? fuel,
        string? availability,
        string? sortBy)
    {
        var carsQuery = _context.Cars
            .Include(c => c.Images)
            .AsQueryable();

        // 1. Text Search (Make, Model, VIN)
        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim().ToLower();
            carsQuery = carsQuery.Where(c =>
                c.Make.ToLower().Contains(q) ||
                c.Model.ToLower().Contains(q) ||
                c.Vin.ToLower().Contains(q));
        }

        // 2. Category Filter
        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            carsQuery = carsQuery.Where(c => c.Category == category);
        }

        // 3. Price Filter
        if (minPrice.HasValue)
        {
            carsQuery = carsQuery.Where(c => c.Price >= minPrice.Value);
        }
        if (maxPrice.HasValue)
        {
            carsQuery = carsQuery.Where(c => c.Price <= maxPrice.Value);
        }

        // 4. Year & HP
        if (minYear.HasValue)
        {
            carsQuery = carsQuery.Where(c => c.Year >= minYear.Value);
        }
        if (minHp.HasValue)
        {
            carsQuery = carsQuery.Where(c => c.Horsepower >= minHp.Value);
        }

        // 5. Transmission & Fuel
        if (!string.IsNullOrWhiteSpace(transmission) && transmission != "All")
        {
            carsQuery = carsQuery.Where(c => c.Transmission == transmission);
        }
        if (!string.IsNullOrWhiteSpace(fuel) && fuel != "All")
        {
            carsQuery = carsQuery.Where(c => c.Fuel == fuel);
        }

        // 6. Availability
        if (availability == "available")
        {
            carsQuery = carsQuery.Where(c => c.IsAvailable && c.StockQuantity > 0);
        }
        else if (availability == "sold")
        {
            carsQuery = carsQuery.Where(c => !c.IsAvailable || c.StockQuantity == 0);
        }

        // 7. Sorting
        carsQuery = sortBy switch
        {
            "price-asc" => carsQuery.OrderBy(c => c.Price),
            "price-desc" => carsQuery.OrderByDescending(c => c.Price),
            "hp-desc" => carsQuery.OrderByDescending(c => c.Horsepower),
            "year-desc" => carsQuery.OrderByDescending(c => c.Year),
            _ => carsQuery.OrderBy(c => c.Make).ThenBy(c => c.Model)
        };

        var cars = await carsQuery.ToListAsync();

        ViewData["Query"] = query;
        ViewData["Category"] = category;
        ViewData["MinPrice"] = minPrice;
        ViewData["MaxPrice"] = maxPrice;
        ViewData["MinYear"] = minYear;
        ViewData["MinHp"] = minHp;
        ViewData["Transmission"] = transmission;
        ViewData["Fuel"] = fuel;
        ViewData["Availability"] = availability;
        ViewData["SortBy"] = sortBy;

        return View(cars);
    }

    [HttpGet]
    public async Task<IActionResult> Details(string vin)
    {
        if (string.IsNullOrEmpty(vin)) return NotFound();

        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Vin == vin);

        if (car == null) return NotFound();

        // Bonus B3: Recommendations (similar category or price range +/- 20%)
        var recommendations = await _context.Cars
            .Include(c => c.Images)
            .Where(c => c.Vin != vin && c.Category == car.Category)
            .Take(3)
            .ToListAsync();

        ViewData["Recommendations"] = recommendations;

        return View(car);
    }
}
