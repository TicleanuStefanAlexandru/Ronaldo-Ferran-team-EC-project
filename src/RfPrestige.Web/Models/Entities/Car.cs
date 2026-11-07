using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RfPrestige.Web.Models.Entities;

public class Car
{
    [Key, StringLength(17, MinimumLength = 17)]
    [RegularExpression(@"^[A-HJ-NPR-Z0-9]{17}$", ErrorMessage = "VIN must be exactly 17 characters and must not contain I, O, or Q.")]
    public string Vin { get; set; } = string.Empty; // Primary Key

    [Required]
    public string Make { get; set; } = string.Empty;

    [Required]
    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public string Category { get; set; } = "Sports"; // Sports, Grand Tourer, Luxury Sedan, SUV

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public int Horsepower { get; set; }

    public int Mileage { get; set; }

    public string Transmission { get; set; } = "Automatic";

    public string Fuel { get; set; } = "Petrol";

    public string EngineDescription { get; set; } = string.Empty;

    public int StockQuantity { get; set; } = 1; // 1 (Available) or 0 (Sold)

    public bool IsAvailable { get; set; } = true;

    public string Description { get; set; } = string.Empty;

    [Timestamp]
    public byte[]? RowVersion { get; set; } // Optimistic Concurrency Token

    public ICollection<CarImage> Images { get; set; } = new List<CarImage>();
}
