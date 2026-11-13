# Ronaldo-Ferran-team-EC-project

Planned use of AI during development

We plan to use Google Antigravity mainly for the following, and we will update this list as the project goes on:

Generating a first version of backend code: Entity Framework Core models, controllers and services (cart, checkout, orders, stock).

Writing the Stripe payment integration and webhook handler, which we then test with the Stripe CLI.

Building Razor views and Bootstrap layouts for the catalog, product page, cart, checkout and admin panel.

Writing the seed script and xUnit tests.

Debugging errors and suggesting fixes.

Drafting documentation


# RF Prestige — Luxury Automotive E-Commerce Prototype

> **Platform for Verified Pre-Owned Luxury and High-Performance Automobiles**  
> Target Demographic: Business owners and senior professionals in Romania (aged 30–55)  
> Acquisition Budgets: €60,000 – €250,000  
> Authors: **Cătălinoiu Luis Roberto** (Backend & Payments Lead) & **Țicleanu Ștefan Alexandru** (Frontend & Administration Lead)

---

## 1. Quick Start & Execution

This prototype is **100% frontend-only** and requires **zero npm packages, build steps, or backend servers**.

### Option A: Direct File Execution (`file://`)
Simply double-click [`index.html`](file:///I:/RF%20Prestige/index.html) in your file explorer. It works immediately in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option B: Static HTTP Server
You can also serve the directory with any static file server:
```bash
# Python 3
python -m http.server 5000

# Node.js
npx serve .
```
Then navigate to `http://localhost:5000`.

---

## 2. Demo User Credentials

The prototype is pre-seeded with two fully functional demo accounts:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Private Customer** | `customer@rfprestige.ro` | `Demo123!` | Browse, Filter, Cart, Saved Addresses (Bucharest & Cluj), Order History, Download Invoices, Wishlist (B2), Submit Reviews (B7) |
| **Staff Admin** | `admin@rfprestige.ro` | `Admin123!` | Everything above + Back-Office Admin Portal (A9): Metrics dashboard, SVG Revenue chart, Car Inventory CRUD (17-char VIN validation), Order status updater, Review moderation |

*Note: Quick autofill buttons are available on the login page for instant one-click authentication.*

---

## 3. Implemented Specification Requirements (A1–A12 & Bonus B1–B7)

| Requirement Code | Requirement Name | Implementation Details |
|---|---|---|
| **A1** | **Product Catalog** | Responsive grid of luxury cars with specs (HP, Mileage, Year, Engine), VIN, price, and primary image. |
| **A2** | **Basic Search** | Header search bar executing live query matching across Make, Model, and 17-character VIN fields. |
| **A3** | **Shopping Cart** | Cart identified by VIN with remove actions, live total calculations, and delivery radio selector (€490 Enclosed Carrier vs €0 Showroom Pickup). |
| **A4** | **User Accounts** | Authentication system with Customer vs Admin role separation, saved Romanian delivery addresses. |
| **A5** | **Checkout Workflow** | Multi-step stepper: Step 1 (Contact & Romanian 6-digit postal code address validation + terms), Step 2 (Order review). |
| **A6** | **Sandbox Payment** | Simulated Stripe hosted payment page (`stripe-mock.html`) with TEST MODE badge and `4242 4242 4242 4242` test card. |
| **A7** | **Stock Management** | Upon payment confirmation (`success.html`), the vehicle is marked `IsAvailable = false` and stock is locked to 0. |
| **A8** | **Order History** | Client dashboard listing past orders, purchased vehicle VINs, status tags, and printable fiscal tax invoices. |
| **A9** | **Custom Admin Panel** | Dedicated back-office area (`/admin/*`) featuring KPI metrics, SVG sales trend chart, car CRUD with VIN validation, order status dropdown, and review moderation. |
| **A10** | **Basic Security** | Hidden `__RequestVerificationToken` anti-forgery inputs on all POST forms; HTML-escaped output via `textContent` and `UI.escapeHtml` to prevent XSS. |
| **A11** | **Responsive Design** | Custom luxury dark theme built with Bootstrap 5.3 flex grid, tested on desktop (1440px), tablet, and mobile (390px). |
| **A12** | **Automated Tests Prep** | `data-testid` attributes on interactive elements; backend integration contract specified in [`docs/INTEGRATION.md`](docs/INTEGRATION.md). |
| **B1** | **Filtered Search** | Sidebar controls: category radio, price slider (€60k–€250k), manufacture year, minimum horsepower (500+, 600+, 700+ HP), transmission, powertrain, and status. |
| **B2** | **Private Wishlist** | AJAX toggle bookmarking cars into private wishlist (unique UserId + CarVin pair) with live sync across cards and details pages. |
| **B3** | **Recommendations** | Vehicle details page displays 3 algorithmic alternatives based on price proximity (±15%) and same category. |
| **B7** | **Site Reviews & Ratings**| 1–5 star rating and comment submission by authenticated clients about the site, with average rating statistics and admin moderation. |

---

## 4. Folder Structure (Mirrors ASP.NET Core MVC Razor Structure)

```
/ (Root)
│
├── index.html                           -> Root entrance / redirect to catalog
│
├── catalog/
│   ├── index.html                       -> Views/Catalog/Index (Filter sidebar, search, live grid, wishlist toggles)
│   └── details.html                     -> Views/Catalog/Details (Car gallery, specs, VIN copy, recommendations)
│
├── cart/
│   └── index.html                       -> Views/Cart/Index (VIN lines, delivery options, live totals)
│
├── checkout/
│   ├── index.html                       -> Views/Checkout/Index (Multi-step delivery address & order review)
│   ├── stripe-mock.html                 -> Fake hosted Stripe Checkout session (test card 4242 4242 4242 4242)
│   ├── success.html                     -> Views/Checkout/Success (Order confirmation, stock locked, cart cleared)
│   └── cancel.html                      -> Views/Checkout/Cancel (Payment cancelled fallback)
│
├── account/
│   ├── login.html                       -> Views/Account/Login (Demo credentials quick-fill, inline validation)
│   ├── register.html                    -> Views/Account/Register (Account creation)
│   ├── orders.html                      -> Views/Orders/History (A8 Order history + printable luxury invoice modal)
│   └── addresses.html                   -> Views/Account/Addresses (Romanian address CRUD + default setting)
│
├── wishlist/
│   └── index.html                       -> Views/Wishlist/Index (B2 Saved cars table, quick add-to-cart)
│
├── reviews/
│   └── index.html                       -> Views/Reviews/Index (B7 Site reviews list, rating distribution, submit form)
│
├── admin/
│   ├── index.html                       -> Views/Admin/Index (Metrics dashboard + SVG revenue chart)
│   ├── cars.html                        -> Views/Admin/Cars (Inventory list with status, edit/delete actions)
│   ├── car-edit.html                    -> Views/Admin/CarEdit (Add/edit car form with 17-char VIN validation)
│   ├── orders.html                      -> Views/Admin/Orders (Orders table with live status updates)
│   └── reviews.html                     -> Views/Admin/Reviews (Site review moderation & removal)
│
├── assets/
│   ├── css/
│   │   └── theme.css                    -> Luxury automotive dark theme (charcoal, champagne gold, typography)
│   ├── js/
│   │   ├── mockdata.js                  -> window.MockData (32 luxury cars, demo users, orders, reviews)
│   │   ├── api.js                       -> window.Api (Promise-based data layer mirroring ASP.NET Core endpoints)
│   │   ├── auth.js                      -> User session management, roles (Customer, Admin), auth guards
│   │   ├── cart.js                      -> Cart calculations, delivery options (€490 / €0), badge sync
│   │   ├── wishlist.js                  -> AJAX-style heart toggle, duplicate prevention
│   │   ├── ui.js                        -> Currency/date formatting, toast notifications, VIN copier, invoice modal
│   │   └── partials.js                  -> Shared Layout (_Layout.cshtml equivalent): navbar, footer, demo reset
│   ├── vendor/                          -> Local Bootstrap 5.3 + Bootstrap Icons copies (ensures 100% offline file:// works)
│   └── img/                             -> High-resolution local automotive SVGs (no external hotlinking)
│
├── docs/
│   └── INTEGRATION.md                   -> Mapping table: Page -> Razor View -> Controller Action -> Entity Fields
└── README.md                            -> This documentation file
```

---

## 5. Prototype State & "Reset Demo Data"

All prototype state (cart, wishlist, logged-in user, orders, addresses, admin edits) is preserved in `localStorage`.  
If you modify data or wish to restart the demo from scratch, click the **"Reset Demo Data"** button located in the footer of every page.

