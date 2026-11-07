using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RfPrestige.Web.Models.Entities;

[Index(nameof(UserId), nameof(CarVin), IsUnique = true)]
public class WishlistItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }

    [Required]
    public string CarVin { get; set; } = string.Empty;

    [ForeignKey("CarVin")]
    public Car? Car { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
