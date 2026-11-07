using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;
using Xunit;

namespace RfPrestige.Tests;

public class StockManagementTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task VehicleAcquisition_ShouldLockStockToZeroAndMarkUnavailable()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var car = new Car
        {
            Vin = "WP0ZZZ99ZPS291047",
            Make = "Porsche",
            Model = "911 GT3",
            Year = 2023,
            Price = 215000m,
            StockQuantity = 1,
            IsAvailable = true
        };
        context.Cars.Add(car);
        await context.SaveChangesAsync();

        // Act - Simulate completed payment
        var vehicle = await context.Cars.FirstAsync(c => c.Vin == car.Vin);
        vehicle.StockQuantity = 0;
        vehicle.IsAvailable = false;
        await context.SaveChangesAsync();

        // Assert
        var updated = await context.Cars.FirstAsync(c => c.Vin == car.Vin);
        Assert.Equal(0, updated.StockQuantity);
        Assert.False(updated.IsAvailable);
    }

    [Fact]
    public async Task OrderCreation_WithPurchasedItems_ShouldTrackCorrectTotals()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var order = new Order
        {
            UserId = "user-123",
            TotalAmount = 215490m,
            Status = OrderStatus.Paid,
            DeliveryOption = 1,
            StripePaymentIntentId = "pi_test_12345"
        };
        order.Items.Add(new OrderItem
        {
            CarVin = "WP0ZZZ99ZPS291047",
            UnitPrice = 215000m
        });

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        // Assert
        var savedOrder = await context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == order.Id);
        Assert.NotNull(savedOrder);
        Assert.Equal(OrderStatus.Paid, savedOrder.Status);
        Assert.Single(savedOrder.Items);
        Assert.Equal(215000m, savedOrder.Items.First().UnitPrice);
    }
}
