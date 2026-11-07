using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Models.Entities;

namespace RfPrestige.Web.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Car> Cars => Set<Car>();
    public DbSet<CarImage> CarImages => Set<CarImage>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<SiteReview> SiteReviews => Set<SiteReview>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Car Vin
        builder.Entity<Car>()
            .HasKey(c => c.Vin);

        builder.Entity<Car>()
            .Property(c => c.Vin)
            .HasMaxLength(17)
            .IsFixedLength();

        // One-to-many Car to CarImages
        builder.Entity<CarImage>()
            .HasOne(ci => ci.Car)
            .WithMany(c => c.Images)
            .HasForeignKey(ci => ci.CarVin)
            .OnDelete(DeleteBehavior.Cascade);

        // One-to-many Order to OrderItems
        builder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // OrderItem to Car
        builder.Entity<OrderItem>()
            .HasOne(oi => oi.Car)
            .WithMany()
            .HasForeignKey(oi => oi.CarVin)
            .OnDelete(DeleteBehavior.Restrict);

        // WishlistItem unique index
        builder.Entity<WishlistItem>()
            .HasIndex(w => new { w.UserId, w.CarVin })
            .IsUnique();

        builder.Entity<WishlistItem>()
            .HasOne(w => w.Car)
            .WithMany()
            .HasForeignKey(w => w.CarVin)
            .OnDelete(DeleteBehavior.Cascade);

        // SiteReview
        builder.Entity<SiteReview>()
            .HasOne(sr => sr.User)
            .WithMany()
            .HasForeignKey(sr => sr.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
