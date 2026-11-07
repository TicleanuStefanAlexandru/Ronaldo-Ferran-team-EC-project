using System.ComponentModel.DataAnnotations;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Models.ViewModels;

public class CheckoutInputModel
{
    public int? SelectedAddressId { get; set; }

    [Required(ErrorMessage = "Recipient name is required.")]
    public string RecipientName { get; set; } = string.Empty;

    public string? Street { get; set; }
    public string? City { get; set; }
    public string? County { get; set; }

    [RegularExpression(@"^\d{6}$", ErrorMessage = "Romanian postal code must be exactly 6 numeric digits.")]
    public string? PostalCode { get; set; }

    public string Country { get; set; } = "Romania";

    public int DeliveryOption { get; set; } = 1;

    [Range(typeof(bool), "true", "true", ErrorMessage = "You must accept the terms of acquisition.")]
    public bool AcceptTerms { get; set; }
}

public class CheckoutViewModel
{
    public CartViewModel Cart { get; set; } = new();
    public List<Address> SavedAddresses { get; set; } = new();
    public CheckoutInputModel Form { get; set; } = new();
}
