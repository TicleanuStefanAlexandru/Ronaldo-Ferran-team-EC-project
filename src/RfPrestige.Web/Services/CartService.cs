using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.ViewModels;

namespace RfPrestige.Web.Services;

public class CartSessionData
{
    public List<string> CarVins { get; set; } = new();
    public int DeliveryOption { get; set; } = 1;
}

public class CartService
{
    private const string CartSessionKey = "RF_PRESTIGE_CART";
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _context;

    public CartService(IHttpContextAccessor httpContextAccessor, AppDbContext context)
    {
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    private ISession Session => _httpContextAccessor.HttpContext!.Session;

    public CartSessionData GetSessionData()
    {
        var json = Session.GetString(CartSessionKey);
        if (string.IsNullOrEmpty(json))
        {
            return new CartSessionData();
        }
        return JsonSerializer.Deserialize<CartSessionData>(json) ?? new CartSessionData();
    }

    public void SaveSessionData(CartSessionData data)
    {
        Session.SetString(CartSessionKey, JsonSerializer.Serialize(data));
    }

    public async Task<CartViewModel> GetCartAsync()
    {
        var data = GetSessionData();
        var cartVm = new CartViewModel
        {
            DeliveryOption = data.DeliveryOption
        };

        if (data.CarVins.Count > 0)
        {
            var cars = await _context.Cars
                .Include(c => c.Images)
                .Where(c => data.CarVins.Contains(c.Vin))
                .ToListAsync();

            foreach (var vin in data.CarVins)
            {
                var car = cars.FirstOrDefault(c => c.Vin == vin);
                if (car != null)
                {
                    cartVm.Items.Add(new CartItemViewModel
                    {
                        CarVin = car.Vin,
                        Make = car.Make,
                        Model = car.Model,
                        Year = car.Year,
                        Price = car.Price,
                        ImageUrl = car.Images.FirstOrDefault()?.ImageUrl ?? "/assets/img/default-car.svg",
                        IsAvailable = car.IsAvailable && car.StockQuantity > 0
                    });
                }
            }
        }

        return cartVm;
    }

    public void AddToCart(string vin)
    {
        var data = GetSessionData();
        if (!data.CarVins.Contains(vin))
        {
            data.CarVins.Add(vin);
            SaveSessionData(data);
        }
    }

    public void RemoveFromCart(string vin)
    {
        var data = GetSessionData();
        if (data.CarVins.Remove(vin))
        {
            SaveSessionData(data);
        }
    }

    public void UpdateDeliveryOption(int deliveryOption)
    {
        var data = GetSessionData();
        data.DeliveryOption = deliveryOption == 0 ? 0 : 1;
        SaveSessionData(data);
    }

    public void ClearCart()
    {
        Session.Remove(CartSessionKey);
    }
}
