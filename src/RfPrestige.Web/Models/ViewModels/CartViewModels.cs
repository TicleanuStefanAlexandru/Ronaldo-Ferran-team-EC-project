using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Models.ViewModels;

public class CartItemViewModel
{
    public string CarVin { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
}

public class CartViewModel
{
    public List<CartItemViewModel> Items { get; set; } = new();
    public int DeliveryOption { get; set; } = 1; // 0 = Showroom Pickup (EUR 0), 1 = Enclosed Trailer (EUR 490)

    public decimal Subtotal => Items.Sum(i => i.Price);
    public decimal DeliveryFee => DeliveryOption == 1 ? 490m : 0m;
    public decimal Total => Subtotal + DeliveryFee;
}
