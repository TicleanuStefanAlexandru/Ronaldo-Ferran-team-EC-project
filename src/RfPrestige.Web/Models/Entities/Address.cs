using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RfPrestige.Web.Models.Entities;

public class Address
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }

    [Required]
    public string Street { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string County { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{6}$", ErrorMessage = "Romanian postal code must be exactly 6 digits.")]
    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = "Romania";

    public bool IsDefault { get; set; } = false;
}
