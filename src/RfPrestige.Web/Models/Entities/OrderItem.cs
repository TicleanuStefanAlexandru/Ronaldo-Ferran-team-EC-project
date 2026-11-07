using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RfPrestige.Web.Models.Entities;

public class OrderItem
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }

    [ForeignKey("OrderId")]
    public Order? Order { get; set; }

    [Required]
    public string CarVin { get; set; } = string.Empty;

    [ForeignKey("CarVin")]
    public Car? Car { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }
}
