using RfPrestige.Web.Models.ViewModels;
using Xunit;

namespace RfPrestige.Tests;

public class CartTests
{
    [Fact]
    public void Cart_WithShowroomPickup_ShouldChargeZeroDelivery()
    {
        // Arrange
        var cart = new CartViewModel
        {
            DeliveryOption = 0, // Showroom pickup
            Items = new List<CartItemViewModel>
            {
                new() { CarVin = "WP0ZZZ99ZPS291047", Price = 215000m }
            }
        };

        // Assert
        Assert.Equal(215000m, cart.Subtotal);
        Assert.Equal(0m, cart.DeliveryFee);
        Assert.Equal(215000m, cart.Total);
    }

    [Fact]
    public void Cart_WithEnclosedTrailerDelivery_ShouldAdd490EuroFee()
    {
        // Arrange
        var cart = new CartViewModel
        {
            DeliveryOption = 1, // Enclosed trailer
            Items = new List<CartItemViewModel>
            {
                new() { CarVin = "WP0ZZZ99ZPS291047", Price = 215000m },
                new() { CarVin = "ZFF94LHA1P0281945", Price = 185000m }
            }
        };

        // Assert
        Assert.Equal(400000m, cart.Subtotal);
        Assert.Equal(490m, cart.DeliveryFee);
        Assert.Equal(400490m, cart.Total);
    }
}
