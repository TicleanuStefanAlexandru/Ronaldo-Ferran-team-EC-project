using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RfPrestige.Web.Models.Entities;

public class CarImage
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string CarVin { get; set; } = string.Empty;

    [ForeignKey("CarVin")]
    public Car? Car { get; set; }

    [Required]
    public string ImageUrl { get; set; } = string.Empty;
}
