using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Data;

public static class DbSeeder
{
    private class SeedDataPayload
    {
        public List<SeedUser>? Users { get; set; }
        public List<SeedAddress>? Addresses { get; set; }
        public List<Car>? Cars { get; set; }
        public List<SeedCarImage>? CarImages { get; set; }
        public List<SeedReview>? SiteReviews { get; set; }
    }

    private class SeedUser
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // plain demo password
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer";
    }

    private class SeedAddress
    {
        public string UserId { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string County { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = "Romania";
        public bool IsDefault { get; set; }
    }

    private class SeedCarImage
    {
        public string CarVin { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }

    private class SeedReview
    {
        public string UserId { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        await context.Database.EnsureCreatedAsync();

        // 1. Seed Roles
        string[] roles = ["Admin", "Customer"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Read Seed JSON file
        var seedFilePath = Path.Combine(AppContext.BaseDirectory, "Data", "seed_data.json");
        if (!File.Exists(seedFilePath))
        {
            seedFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "seed_data.json");
        }

        if (!File.Exists(seedFilePath))
        {
            return;
        }

        var json = await File.ReadAllTextAsync(seedFilePath);
        var seedData = JsonSerializer.Deserialize<SeedDataPayload>(json);
        if (seedData == null) return;

        // 3. Seed Users
        var userMap = new Dictionary<string, ApplicationUser>();
        if (seedData.Users != null)
        {
            foreach (var su in seedData.Users)
            {
                var existingUser = await userManager.FindByEmailAsync(su.Email);
                if (existingUser == null)
                {
                    var newUser = new ApplicationUser
                    {
                        UserName = su.Email,
                        Email = su.Email,
                        EmailConfirmed = true,
                        FirstName = su.FirstName,
                        LastName = su.LastName,
                        Role = su.Role
                    };
                    var result = await userManager.CreateAsync(newUser, su.PasswordHash);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newUser, su.Role);
                        userMap[su.Id] = newUser;
                    }
                }
                else
                {
                    userMap[su.Id] = existingUser;
                }
            }
        }

        // 4. Seed Cars and CarImages
        if (!await context.Cars.AnyAsync() && seedData.Cars != null)
        {
            await context.Cars.AddRangeAsync(seedData.Cars);
            await context.SaveChangesAsync();

            if (seedData.CarImages != null)
            {
                var images = seedData.CarImages.Select(img => new CarImage
                {
                    CarVin = img.CarVin,
                    ImageUrl = img.ImageUrl.Replace("../", "/")
                }).ToList();

                await context.CarImages.AddRangeAsync(images);
                await context.SaveChangesAsync();
            }
        }

        // 5. Seed Addresses
        if (!await context.Addresses.AnyAsync() && seedData.Addresses != null)
        {
            foreach (var sa in seedData.Addresses)
            {
                if (userMap.TryGetValue(sa.UserId, out var appUser))
                {
                    context.Addresses.Add(new Address
                    {
                        UserId = appUser.Id,
                        Street = sa.Street,
                        City = sa.City,
                        County = sa.County,
                        PostalCode = sa.PostalCode,
                        Country = sa.Country,
                        IsDefault = sa.IsDefault
                    });
                }
            }
            await context.SaveChangesAsync();
        }

        // 6. Seed Site Reviews
        if (!await context.SiteReviews.AnyAsync() && seedData.SiteReviews != null)
        {
            foreach (var sr in seedData.SiteReviews)
            {
                if (userMap.TryGetValue(sr.UserId, out var appUser))
                {
                    context.SiteReviews.Add(new SiteReview
                    {
                        UserId = appUser.Id,
                        Rating = sr.Rating,
                        Comment = sr.Comment,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
