# RF Prestige — ASP.NET Core MVC Backend Integration Guide

This document details the contract between the frontend prototype and the target **ASP.NET Core MVC (C#) + Entity Framework Core (SQLite) + Stripe** architecture.

---

## 1. System Architecture Mapping

All data access is encapsulated strictly within [`assets/js/api.js`](file:///I:/RF%20Prestige/assets/js/api.js).
To connect to ASP.NET Core controllers, the backend engineer only replaces the internal `localStorage` logic in `api.js` with `fetch('/api/...')` or standard Razor form submissions.

### Page to Razor View & Controller Action Mapping Table

| Page Path (Frontend) | Future Razor View | Controller & Action | HTTP Method | Data Fields Used | `api.js` Function | Access Level |
|---|---|---|---|---|---|---|
| `/index.html` | `Views/Home/Index.cshtml` | `HomeController.Index()` | `GET` | — | — | Public |
| `/catalog/index.html` | `Views/Catalog/Index.cshtml` | `CatalogController.Index(filters)` | `GET` | `query`, `category`, `minPrice`, `maxPrice`, `minYear`, `minHp`, `transmission`, `fuel`, `availability`, `sortBy` | `Api.getCars(filters)` | Public |
| `/catalog/details.html?vin={vin}` | `Views/Catalog/Details.cshtml` | `CatalogController.Details(string vin)` | `GET` | `Car.*`, `CarImage.*` | `Api.getCarByVin(vin)`, `Api.getRecommended(vin)` | Public |
| `/cart/index.html` | `Views/Cart/Index.cshtml` | `CartController.Index()` | `GET`, `POST` | `CarVin`, `DeliveryOption`, `UnitPrice` | `Api.getCart()`, `Api.addToCart()`, `Api.removeFromCart()`, `Api.updateCartDelivery()` | Public / Session |
| `/checkout/index.html` | `Views/Checkout/Index.cshtml` | `CheckoutController.Index()` | `GET`, `POST` | `Recipient`, `Street`, `City`, `County`, `PostalCode`, `Country`, `DeliveryOption` | `Api.createCheckoutSession(payload)` | Authenticated |
| `/checkout/stripe-mock.html` | Hosted Stripe Session / Sandbox | `CheckoutController.CreateStripeSession()` | `POST` | `Amount`, `Currency`, `SuccessUrl`, `CancelUrl`, `Metadata[OrderId]` | `Api.getPendingCheckout()` | Authenticated |
| `/checkout/success.html` | `Views/Checkout/Success.cshtml` | `CheckoutController.Success(string sessionId)` | `GET` | `Order.Id`, `Order.Status`, `StripePaymentIntentId` | `Api.confirmStripePayment()` | Authenticated |
| `/checkout/cancel.html` | `Views/Checkout/Cancel.cshtml` | `CheckoutController.Cancel()` | `GET` | — | — | Authenticated |
| `/account/login.html` | `Areas/Identity/Pages/Account/Login.cshtml` | `AccountController.Login()` | `POST` | `Email`, `Password`, `RememberMe`, `__RequestVerificationToken` | `Auth.login(email, pass)` | Public |
| `/account/register.html` | `Areas/Identity/Pages/Account/Register.cshtml` | `AccountController.Register()` | `POST` | `FirstName`, `LastName`, `Email`, `Password`, `__RequestVerificationToken` | `Auth.register(data)` | Public |
| `/account/orders.html` | `Views/Orders/History.cshtml` | `OrdersController.History()` | `GET` | `Order.Id`, `Order.CreatedAt`, `Order.TotalAmount`, `Order.Status`, `Order.DeliveryOption`, `OrderItem.*` | `Api.getOrderHistory(userId)`, `Api.getOrderById(id)` | Authenticated |
| `/account/addresses.html` | `Views/Account/Addresses.cshtml` | `AccountController.Addresses()` | `GET`, `POST` | `Address.Id`, `Address.Street`, `Address.City`, `Address.County`, `Address.PostalCode`, `Address.IsDefault` | `Api.getAddresses()`, `Api.saveAddress()`, `Api.deleteAddress()`, `Api.setDefaultAddress()` | Authenticated |
| `/wishlist/index.html` | `Views/Wishlist/Index.cshtml` | `WishlistController.Index()` | `GET`, `POST` | `WishlistItem.Id`, `WishlistItem.UserId`, `WishlistItem.CarVin`, `Car.*` | `Api.getWishlist()`, `Api.toggleWishlist()` | Authenticated |
| `/reviews/index.html` | `Views/Reviews/Index.cshtml` | `ReviewsController.Index()` | `GET`, `POST` | `SiteReview.Rating`, `SiteReview.Comment`, `SiteReview.CreatedAt`, `SiteReview.UserName` | `Api.getReviews()`, `Api.createReview()` | Public / Authenticated |
| `/admin/index.html` | `Areas/Admin/Views/Dashboard/Index.cshtml` | `AdminController.Index()` | `GET` | Total Revenue, Orders Count, Stock Count, Average Rating | `Api.adminGetMetrics()` | Admin Only |
| `/admin/cars.html` | `Areas/Admin/Views/Cars/Index.cshtml` | `AdminCarsController.Index()` | `GET`, `POST` | `Car.*`, `CarImage.*` | `Api.adminGetCars()`, `Api.adminDeleteCar()` | Admin Only |
| `/admin/car-edit.html` | `Areas/Admin/Views/Cars/Edit.cshtml` | `AdminCarsController.Edit(string vin)` | `GET`, `POST` | `Car.Vin` (17 chars, PK), `Make`, `Model`, `Year`, `Price`, `HP`, `Mileage`, `Stock`, `IsAvailable` | `Api.adminSaveCar()` | Admin Only |
| `/admin/orders.html` | `Areas/Admin/Views/Orders/Index.cshtml` | `AdminOrdersController.Index()` | `GET`, `POST` | `Order.Id`, `Order.Status`, `Order.CustomerName`, `Order.TotalAmount` | `Api.adminGetOrders()`, `Api.adminUpdateOrderStatus()` | Admin Only |
| `/admin/reviews.html` | `Areas/Admin/Views/Reviews/Index.cshtml` | `AdminReviewsController.Index()` | `GET`, `POST` | `SiteReview.Id`, `SiteReview.Rating`, `SiteReview.Comment` | `Api.adminGetReviews()`, `Api.adminDeleteReview()` | Admin Only |

---

## 2. Entity Model Definitions (EF Core / C#)

All mock entities and UI data models adhere strictly to the following PascalCase conventions:

### `ApplicationUser : IdentityUser`
```csharp
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // "Customer" | "Admin"
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
```

### `Address`
```csharp
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
    [Required, RegularExpression(@"^\d{6}$")]
    public string PostalCode { get; set; } = string.Empty; // Romanian 6-digit postal code
    public string Country { get; set; } = "Romania";
    public bool IsDefault { get; set; } = false;
}
```

### `Car`
```csharp
public class Car
{
    [Key, StringLength(17, MinimumLength = 17)]
    [RegularExpression(@"^[A-HJ-NPR-Z0-9]{17}$", ErrorMessage = "VIN must not contain I, O, or Q")]
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
    public int StockQuantity { get; set; } = 1; // 1 (Avail) or 0 (Sold)
    public bool IsAvailable { get; set; } = true;
    public string Description { get; set; } = string.Empty;
    [Timestamp]
    public byte[]? RowVersion { get; set; } // Optimistic Concurrency Token
    public ICollection<CarImage> Images { get; set; } = new List<CarImage>();
}
```

### `CarImage`
```csharp
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
```

### `Order`
```csharp
public enum OrderStatus { Pending, Paid, Shipped, Delivered, Cancelled }

public class Order
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string UserId { get; set; } = string.Empty;
    public int ShippingAddressId { get; set; }
    [ForeignKey("ShippingAddressId")]
    public Address? ShippingAddress { get; set; }
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? StripePaymentIntentId { get; set; }
    public int DeliveryOption { get; set; } = 1; // 0 = Showroom Pickup (EUR 0), 1 = Enclosed Trailer (+EUR 490)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
```

### `OrderItem`
```csharp
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
```

### `WishlistItem`
```csharp
[Index(nameof(UserId), nameof(CarVin), IsUnique = true)]
public class WishlistItem
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string UserId { get; set; } = string.Empty;
    [Required]
    public string CarVin { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
```

### `SiteReview`
```csharp
public class SiteReview
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string UserId { get; set; } = string.Empty;
    [Range(1, 5)]
    public int Rating { get; set; }
    [Required]
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

---

## 3. Key Architectural Assumptions

1. **VIN as Primary Key**: Cars are identified globally by `Vin` (17 chars). Standard international VIN rules apply: characters `I`, `O`, and `Q` are forbidden.
2. **Single-Unit Luxury Inventory**: Each vehicle has `StockQuantity = 1`. Upon payment confirmation (Stripe webhook `checkout.session.completed`), the backend sets `IsAvailable = false` and decrements `StockQuantity` to 0.
3. **Delivery Charges**:
   - `0`: Showroom Pickup in Bucharest (€0).
   - `1`: Enclosed Specialized Covered Trailer (+€490).
4. **Romanian Address Specifics**:
   - Country is defaulted to `Romania`.
   - Romanian postal codes are strictly 6 numeric digits (e.g. `011861` for Bucharest Aviatorilor, `400129` for Cluj-Napoca).
5. **CSRF Anti-Forgery**:
   - All forms contain `<input type="hidden" name="__RequestVerificationToken" value="..." />`.
   - Maps directly to `[ValidateAntiForgeryToken]` in ASP.NET Core controllers.
6. **XSS Protection**:
   - All rendering functions in `ui.js` and individual pages use `textContent` or `UI.escapeHtml()`.

