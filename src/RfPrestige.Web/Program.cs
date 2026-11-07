using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RfPrestige.Web.Data;
using RfPrestige.Web.Models.Entities;
using RfPrestige.Web.Services;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=rfprestige.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Add ASP.NET Core Identity (A4)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
});

// Configure Session (for Shopping Cart A3)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(4);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<CartService>();

// Anti-forgery configuration (A10)
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});

// Add Controllers & Views
builder.Services.AddControllersWithViews();

// Configure Stripe (A6)
var stripeSecretKey = builder.Configuration["Stripe:SecretKey"];
if (!string.IsNullOrEmpty(stripeSecretKey))
{
    StripeConfiguration.ApiKey = stripeSecretKey;
}

var app = builder.Build();

// Seed Database automatically on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        await DbSeeder.SeedAsync(scope.ServiceProvider);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// HTTP pipeline configuration
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

var rootAssetsPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "..", "assets"));
if (Directory.Exists(rootAssetsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(rootAssetsPath),
        RequestPath = "/assets"
    });
}

app.UseRouting();

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
