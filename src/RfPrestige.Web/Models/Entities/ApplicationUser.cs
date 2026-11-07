using Microsoft.AspNetCore.Identity;

namespace RfPrestige.Web.Models.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // "Customer" | "Admin"
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
