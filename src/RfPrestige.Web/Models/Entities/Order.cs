using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RfPrestige.Web.Models.Entities;

public enum OrderStatus
{
    Pending,
    Paid,
    Shipped,
    Delivered,
    Cancelled
}

public class Order
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }

    public int? ShippingAddressId { get; set; }

    [ForeignKey("ShippingAddressId")]
    public Address? ShippingAddress { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public string? StripePaymentIntentId { get; set; }

    public int DeliveryOption { get; set; } = 1; // 0 = Showroom Pickup (EUR 0), 1 = Enclosed Trailer (+EUR 490)

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
