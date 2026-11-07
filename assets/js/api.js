/**
 * RF Prestige — API Data Access Layer
 * ALL data access goes through this file.
 * Mirrors future ASP.NET Core MVC / EF Core endpoints and returns Promises.
 * When integrating with the backend, teammate replaces these bodies with fetch() calls.
 */

(function () {
  'use strict';

  var STORAGE_KEYS = {
    CARS: 'rf_prestige_cars',
    CAR_IMAGES: 'rf_prestige_car_images',
    ADDRESSES: 'rf_prestige_addresses',
    ORDERS: 'rf_prestige_orders',
    WISHLIST: 'rf_prestige_wishlist',
    REVIEWS: 'rf_prestige_reviews',
    CART: 'rf_prestige_cart',
    CURRENT_USER: 'rf_prestige_user',
    PENDING_CHECKOUT: 'rf_prestige_pending_checkout'
  };

  // Initialize LocalStorage from window.MockData if not present
  function initStorage() {
    if (!window.MockData) {
      console.error('MockData not found. Ensure mockdata.js is loaded prior to api.js');
      return;
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(window.MockData.Cars));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAR_IMAGES)) {
      localStorage.setItem(STORAGE_KEYS.CAR_IMAGES, JSON.stringify(window.MockData.CarImages));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(window.MockData.Addresses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(window.MockData.Orders));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(window.MockData.WishlistItems));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(window.MockData.SiteReviews));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({ items: [], deliveryOption: 1 }));
    }
    // Set default customer user for convenience if none logged in
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(window.MockData.Users[0]));
    }
  }

  initStorage();

  function getItem(key, defaultVal) {
    var raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return defaultVal;
    }
  }

  function setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Helper to attach images to car objects
  function attachImages(car) {
    if (!car) return null;
    var allImages = getItem(STORAGE_KEYS.CAR_IMAGES, []);
    var carImgs = allImages.filter(function (img) {
      return img.CarVin === car.Vin;
    });
    // Ensure fallback if no images found
    if (!carImgs.length) {
      carImgs = [
        { Id: 1, CarVin: car.Vin, ImageUrl: '../assets/img/' + car.Vin + '-1.svg' },
        { Id: 2, CarVin: car.Vin, ImageUrl: '../assets/img/' + car.Vin + '-2.svg' },
        { Id: 3, CarVin: car.Vin, ImageUrl: '../assets/img/' + car.Vin + '-3.svg' },
        { Id: 4, CarVin: car.Vin, ImageUrl: '../assets/img/' + car.Vin + '-4.svg' }
      ];
    }
    var copy = Object.assign({}, car);
    copy.Images = carImgs;
    copy.PrimaryImageUrl = carImgs[0] ? carImgs[0].ImageUrl : '../assets/img/' + car.Vin + '-1.svg';
    return copy;
  }

  // --- PUBLIC API EXPORTS ---
  var Api = {

    /**
     * Resets prototype data back to fresh seed state
     */
    resetDemoData: function () {
      return new Promise(function (resolve) {
        localStorage.removeItem(STORAGE_KEYS.CARS);
        localStorage.removeItem(STORAGE_KEYS.CAR_IMAGES);
        localStorage.removeItem(STORAGE_KEYS.ADDRESSES);
        localStorage.removeItem(STORAGE_KEYS.ORDERS);
        localStorage.removeItem(STORAGE_KEYS.WISHLIST);
        localStorage.removeItem(STORAGE_KEYS.REVIEWS);
        localStorage.removeItem(STORAGE_KEYS.CART);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.PENDING_CHECKOUT);
        initStorage();
        resolve(true);
      });
    },

    // =========================================================================
    // CATALOG & VEHICLES
    // Future Route: GET /Catalog
    // =========================================================================
    getCars: function (filters) {
      return new Promise(function (resolve) {
        filters = filters || {};
        var cars = getItem(STORAGE_KEYS.CARS, []).map(attachImages);

        var result = cars.filter(function (car) {
          // Search query (Make, Model, VIN)
          if (filters.query && filters.query.trim()) {
            var q = filters.query.trim().toLowerCase();
            var makeMatch = car.Make && car.Make.toLowerCase().indexOf(q) !== -1;
            var modelMatch = car.Model && car.Model.toLowerCase().indexOf(q) !== -1;
            var vinMatch = car.Vin && car.Vin.toLowerCase().indexOf(q) !== -1;
            var combinedMatch = (car.Make + ' ' + car.Model).toLowerCase().indexOf(q) !== -1;
            if (!makeMatch && !modelMatch && !vinMatch && !combinedMatch) {
              return false;
            }
          }

          // Category
          if (filters.category && filters.category !== 'all') {
            if (car.Category !== filters.category) return false;
          }

          // Price Range
          if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
            if (car.Price < Number(filters.minPrice)) return false;
          }
          if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
            if (car.Price > Number(filters.maxPrice)) return false;
          }

          // Year Range
          if (filters.minYear) {
            if (car.Year < Number(filters.minYear)) return false;
          }
          if (filters.maxYear) {
            if (car.Year > Number(filters.maxYear)) return false;
          }

          // Min Horsepower
          if (filters.minHp) {
            if (car.Horsepower < Number(filters.minHp)) return false;
          }

          // Transmission
          if (filters.transmission && filters.transmission !== 'all') {
            if (car.Transmission.toLowerCase().indexOf(filters.transmission.toLowerCase()) === -1) {
              return false;
            }
          }

          // Fuel
          if (filters.fuel && filters.fuel !== 'all') {
            if (car.Fuel.toLowerCase() !== filters.fuel.toLowerCase()) {
              return false;
            }
          }

          // Availability
          if (filters.availability === 'available') {
            if (!car.IsAvailable) return false;
          } else if (filters.availability === 'sold') {
            if (car.IsAvailable) return false;
          }

          return true;
        });

        // Sorting
        var sort = filters.sortBy || 'featured';
        if (sort === 'price-asc') {
          result.sort(function (a, b) { return a.Price - b.Price; });
        } else if (sort === 'price-desc') {
          result.sort(function (a, b) { return b.Price - a.Price; });
        } else if (sort === 'year-desc') {
          result.sort(function (a, b) { return b.Year - a.Year; });
        } else if (sort === 'hp-desc') {
          result.sort(function (a, b) { return b.Horsepower - a.Horsepower; });
        } else if (sort === 'mileage-asc') {
          result.sort(function (a, b) { return a.Mileage - b.Mileage; });
        }

        resolve(result);
      });
    },

    // =========================================================================
    // VEHICLE DETAILS
    // Future Route: GET /Catalog/Details/{vin}
    // =========================================================================
    getCarByVin: function (vin) {
      return new Promise(function (resolve, reject) {
        if (!vin) {
          resolve(null);
          return;
        }
        var cars = getItem(STORAGE_KEYS.CARS, []);
        var found = cars.find(function (c) {
          return c.Vin.toUpperCase() === vin.trim().toUpperCase();
        });
        if (found) {
          resolve(attachImages(found));
        } else {
          resolve(null);
        }
      });
    },

    // =========================================================================
    // RECOMMENDATIONS (Bonus B3)
    // Suggests 3 similar cars based on price proximity (+/-15%) and same category
    // =========================================================================
    getRecommended: function (vin) {
      return new Promise(function (resolve) {
        var cars = getItem(STORAGE_KEYS.CARS, []).map(attachImages);
        var target = cars.find(function (c) {
          return c.Vin.toUpperCase() === vin.trim().toUpperCase();
        });

        if (!target) {
          resolve(cars.slice(0, 3));
          return;
        }

        var minPrice = target.Price * 0.85;
        var maxPrice = target.Price * 1.15;

        // Same category within +/- 15% price, available first, excluding target
        var matches = cars.filter(function (c) {
          return c.Vin !== target.Vin &&
                 c.Category === target.Category &&
                 c.Price >= minPrice &&
                 c.Price <= maxPrice;
        });

        // If fewer than 3 found, expand criteria to same category or closest prices
        if (matches.length < 3) {
          var categoryFallbacks = cars.filter(function (c) {
            return c.Vin !== target.Vin && c.Category === target.Category && matches.indexOf(c) === -1;
          });
          matches = matches.concat(categoryFallbacks);
        }

        if (matches.length < 3) {
          var priceFallbacks = cars.filter(function (c) {
            return c.Vin !== target.Vin && matches.indexOf(c) === -1;
          }).sort(function (a, b) {
            return Math.abs(a.Price - target.Price) - Math.abs(b.Price - target.Price);
          });
          matches = matches.concat(priceFallbacks);
        }

        resolve(matches.slice(0, 3));
      });
    },

    // =========================================================================
    // SHOPPING CART (A3)
    // Future Routes: GET /Cart, POST /Cart/Add, POST /Cart/Remove
    // =========================================================================
    getCart: function () {
      return new Promise(function (resolve) {
        var rawCart = getItem(STORAGE_KEYS.CART, { items: [], deliveryOption: 1 });
        var cars = getItem(STORAGE_KEYS.CARS, []).map(attachImages);

        var hydratedItems = [];
        var subtotal = 0;

        rawCart.items.forEach(function (item) {
          var car = cars.find(function (c) { return c.Vin === item.CarVin; });
          if (car) {
            hydratedItems.push({
              CarVin: car.Vin,
              UnitPrice: car.Price,
              Car: car
            });
            subtotal += car.Price;
          }
        });

        var deliveryFee = rawCart.deliveryOption === 1 ? 490 : 0;
        var total = subtotal + deliveryFee;

        resolve({
          items: hydratedItems,
          deliveryOption: rawCart.deliveryOption, // 0 = Showroom Pickup, 1 = Enclosed Trailer
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          total: total,
          itemCount: hydratedItems.length
        });
      });
    },

    addToCart: function (vin) {
      return new Promise(function (resolve, reject) {
        var cars = getItem(STORAGE_KEYS.CARS, []);
        var car = cars.find(function (c) { return c.Vin.toUpperCase() === vin.toUpperCase(); });

        if (!car) {
          reject(new Error("Vehicle not found."));
          return;
        }
        if (!car.IsAvailable || car.StockQuantity <= 0) {
          reject(new Error("This luxury vehicle has already been reserved or sold."));
          return;
        }

        var rawCart = getItem(STORAGE_KEYS.CART, { items: [], deliveryOption: 1 });
        var existing = rawCart.items.find(function (i) { return i.CarVin === car.Vin; });

        if (existing) {
          // Already in cart (single-unit inventory)
          resolve({ added: false, message: "Vehicle is already in your acquisition cart." });
          return;
        }

        rawCart.items.push({ CarVin: car.Vin });
        setItem(STORAGE_KEYS.CART, rawCart);
        resolve({ added: true, message: car.Year + " " + car.Make + " " + car.Model + " added to your cart." });
      });
    },

    removeFromCart: function (vin) {
      return new Promise(function (resolve) {
        var rawCart = getItem(STORAGE_KEYS.CART, { items: [], deliveryOption: 1 });
        rawCart.items = rawCart.items.filter(function (i) { return i.CarVin !== vin; });
        setItem(STORAGE_KEYS.CART, rawCart);
        resolve(true);
      });
    },

    updateCartDelivery: function (deliveryOption) {
      return new Promise(function (resolve) {
        var rawCart = getItem(STORAGE_KEYS.CART, { items: [], deliveryOption: 1 });
        rawCart.deliveryOption = Number(deliveryOption);
        setItem(STORAGE_KEYS.CART, rawCart);
        resolve(rawCart.deliveryOption);
      });
    },

    clearCart: function () {
      return new Promise(function (resolve) {
        setItem(STORAGE_KEYS.CART, { items: [], deliveryOption: 1 });
        resolve(true);
      });
    },

    // =========================================================================
    // CHECKOUT & STRIPE SANDBOX (A5, A6, A7)
    // Future Routes: GET /Checkout, POST /Checkout/CreateSession, POST /Webhooks/Stripe
    // =========================================================================
    createCheckoutSession: function (orderPayload) {
      return new Promise(function (resolve, reject) {
        if (!orderPayload || !orderPayload.Items || !orderPayload.Items.length) {
          reject(new Error("Cannot create a checkout session with an empty cart."));
          return;
        }

        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        var nextId = 1044;
        if (orders.length) {
          var maxId = Math.max.apply(Math, orders.map(function (o) { return o.Id; }));
          nextId = maxId + 1;
        }

        var pendingOrder = {
          Id: nextId,
          UserId: orderPayload.UserId,
          CustomerName: orderPayload.CustomerName,
          CustomerEmail: orderPayload.CustomerEmail,
          ShippingAddressId: orderPayload.ShippingAddressId || null,
          ShippingAddressText: orderPayload.ShippingAddressText,
          DeliveryOption: orderPayload.DeliveryOption,
          TotalAmount: orderPayload.TotalAmount,
          Status: "Pending",
          StripePaymentIntentId: "pi_test_" + Math.random().toString(36).substring(2, 12),
          CreatedAt: new Date().toISOString(),
          Items: orderPayload.Items
        };

        // Persist session to pending checkout storage
        setItem(STORAGE_KEYS.PENDING_CHECKOUT, pendingOrder);

        resolve({
          sessionId: "cs_test_" + Math.random().toString(36).substring(2, 15),
          redirectUrl: "../checkout/stripe-mock.html",
          orderId: nextId,
          pendingOrder: pendingOrder
        });
      });
    },

    getPendingCheckout: function () {
      return new Promise(function (resolve) {
        resolve(getItem(STORAGE_KEYS.PENDING_CHECKOUT, null));
      });
    },

    confirmStripePayment: function () {
      return new Promise(function (resolve, reject) {
        var pending = getItem(STORAGE_KEYS.PENDING_CHECKOUT, null);
        if (!pending) {
          reject(new Error("No active checkout session found."));
          return;
        }

        // 1. Mark Order as Paid
        pending.Status = "Paid";
        pending.PaidAt = new Date().toISOString();

        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        orders.unshift(pending);
        setItem(STORAGE_KEYS.ORDERS, orders);

        // 2. Stock Management (A7): Lock stock & set IsAvailable = false
        var cars = getItem(STORAGE_KEYS.CARS, []);
        pending.Items.forEach(function (item) {
          var car = cars.find(function (c) { return c.Vin === item.CarVin; });
          if (car) {
            car.IsAvailable = false;
            car.StockQuantity = Math.max(0, car.StockQuantity - 1);
          }
        });
        setItem(STORAGE_KEYS.CARS, cars);

        // 3. Clear cart
        setItem(STORAGE_KEYS.CART, { items: [], deliveryOption: 1 });
        localStorage.removeItem(STORAGE_KEYS.PENDING_CHECKOUT);

        resolve(pending);
      });
    },

    // =========================================================================
    // ORDERS & USER HISTORY (A8)
    // Future Route: GET /Orders/History
    // =========================================================================
    getOrderHistory: function (userId) {
      return new Promise(function (resolve) {
        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        if (userId) {
          orders = orders.filter(function (o) { return o.UserId === userId; });
        }
        resolve(orders);
      });
    },

    getOrderById: function (orderId) {
      return new Promise(function (resolve) {
        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        var found = orders.find(function (o) { return o.Id === Number(orderId); });
        resolve(found || null);
      });
    },

    // =========================================================================
    // ADDRESSES (A4, A5)
    // Future Routes: GET/POST /Account/Addresses
    // =========================================================================
    getAddresses: function (userId) {
      return new Promise(function (resolve) {
        var list = getItem(STORAGE_KEYS.ADDRESSES, []);
        if (userId) {
          list = list.filter(function (a) { return a.UserId === userId; });
        }
        resolve(list);
      });
    },

    saveAddress: function (addressData) {
      return new Promise(function (resolve, reject) {
        // Validate postal code: Romanian postal codes are exactly 6 digits
        var cleanPostal = String(addressData.PostalCode || '').trim();
        if (!/^\d{6}$/.test(cleanPostal)) {
          reject(new Error("Romanian postal code must consist of exactly 6 digits (e.g. 011861)."));
          return;
        }

        var list = getItem(STORAGE_KEYS.ADDRESSES, []);

        if (addressData.IsDefault) {
          list.forEach(function (a) {
            if (a.UserId === addressData.UserId) {
              a.IsDefault = false;
            }
          });
        }

        var saved;
        if (addressData.Id) {
          // Update
          var idx = list.findIndex(function (a) { return a.Id === Number(addressData.Id); });
          if (idx !== -1) {
            list[idx] = Object.assign({}, list[idx], addressData, { PostalCode: cleanPostal });
            saved = list[idx];
          }
        } else {
          // Add new
          var maxId = 0;
          list.forEach(function (a) { if (a.Id > maxId) maxId = a.Id; });
          saved = {
            Id: maxId + 1,
            UserId: addressData.UserId,
            Street: addressData.Street,
            City: addressData.City,
            County: addressData.County,
            PostalCode: cleanPostal,
            Country: addressData.Country || "Romania",
            IsDefault: Boolean(addressData.IsDefault)
          };
          list.push(saved);
        }

        setItem(STORAGE_KEYS.ADDRESSES, list);
        resolve(saved);
      });
    },

    deleteAddress: function (addressId) {
      return new Promise(function (resolve) {
        var list = getItem(STORAGE_KEYS.ADDRESSES, []);
        list = list.filter(function (a) { return a.Id !== Number(addressId); });
        setItem(STORAGE_KEYS.ADDRESSES, list);
        resolve(true);
      });
    },

    setDefaultAddress: function (addressId, userId) {
      return new Promise(function (resolve) {
        var list = getItem(STORAGE_KEYS.ADDRESSES, []);
        list.forEach(function (a) {
          if (a.UserId === userId) {
            a.IsDefault = (a.Id === Number(addressId));
          }
        });
        setItem(STORAGE_KEYS.ADDRESSES, list);
        resolve(true);
      });
    },

    // =========================================================================
    // WISHLIST (B2)
    // Future Routes: GET /Wishlist, POST /Wishlist/Toggle
    // Unique pair: (UserId + CarVin)
    // =========================================================================
    getWishlist: function (userId) {
      return new Promise(function (resolve) {
        var wishlistItems = getItem(STORAGE_KEYS.WISHLIST, []);
        if (userId) {
          wishlistItems = wishlistItems.filter(function (w) { return w.UserId === userId; });
        }
        var cars = getItem(STORAGE_KEYS.CARS, []).map(attachImages);

        var hydrated = [];
        wishlistItems.forEach(function (item) {
          var car = cars.find(function (c) { return c.Vin === item.CarVin; });
          if (car) {
            hydrated.push({
              Id: item.Id,
              UserId: item.UserId,
              CarVin: item.CarVin,
              AddedAt: item.AddedAt,
              Car: car
            });
          }
        });

        resolve(hydrated);
      });
    },

    isInWishlist: function (vin, userId) {
      if (!userId || !vin) return false;
      var wishlistItems = getItem(STORAGE_KEYS.WISHLIST, []);
      return wishlistItems.some(function (w) {
        return w.UserId === userId && w.CarVin.toUpperCase() === vin.toUpperCase();
      });
    },

    toggleWishlist: function (vin, userId) {
      return new Promise(function (resolve, reject) {
        if (!userId) {
          reject(new Error("Authentication required to manage your wishlist."));
          return;
        }

        var wishlistItems = getItem(STORAGE_KEYS.WISHLIST, []);
        var normVin = vin.toUpperCase();
        var existingIdx = wishlistItems.findIndex(function (w) {
          return w.UserId === userId && w.CarVin.toUpperCase() === normVin;
        });

        var inWishlist = false;
        if (existingIdx !== -1) {
          // Remove
          wishlistItems.splice(existingIdx, 1);
          inWishlist = false;
        } else {
          // Add
          var maxId = 0;
          wishlistItems.forEach(function (w) { if (w.Id > maxId) maxId = w.Id; });
          wishlistItems.push({
            Id: maxId + 1,
            UserId: userId,
            CarVin: normVin,
            AddedAt: new Date().toISOString()
          });
          inWishlist = true;
        }

        setItem(STORAGE_KEYS.WISHLIST, wishlistItems);
        var userCount = wishlistItems.filter(function (w) { return w.UserId === userId; }).length;
        resolve({ inWishlist: inWishlist, count: userCount });
      });
    },

    // =========================================================================
    // SITE REVIEWS (B7)
    // Future Routes: GET /Reviews, POST /Reviews/Create
    // Note: Reviews are about the SITE, not individual cars.
    // =========================================================================
    getReviews: function () {
      return new Promise(function (resolve) {
        var reviews = getItem(STORAGE_KEYS.REVIEWS, []);
        var total = reviews.length;
        var sum = 0;
        var distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach(function (r) {
          sum += r.Rating;
          distribution[r.Rating] = (distribution[r.Rating] || 0) + 1;
        });

        var avg = total > 0 ? (sum / total).toFixed(1) : "5.0";

        // Sort latest first
        reviews.sort(function (a, b) {
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        });

        resolve({
          reviews: reviews,
          averageRating: parseFloat(avg),
          totalCount: total,
          distribution: distribution
        });
      });
    },

    createReview: function (reviewData) {
      return new Promise(function (resolve, reject) {
        var rating = Number(reviewData.Rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          reject(new Error("Please select a rating between 1 and 5 stars."));
          return;
        }
        var comment = String(reviewData.Comment || '').trim();
        if (!comment) {
          reject(new Error("Review comment cannot be empty."));
          return;
        }

        var reviews = getItem(STORAGE_KEYS.REVIEWS, []);
        var maxId = 0;
        reviews.forEach(function (r) { if (r.Id > maxId) maxId = r.Id; });

        var newReview = {
          Id: maxId + 1,
          UserId: reviewData.UserId || "usr-cust-001",
          UserName: reviewData.UserName || "Verified Client",
          Rating: rating,
          Comment: comment,
          CreatedAt: new Date().toISOString()
        };

        reviews.unshift(newReview);
        setItem(STORAGE_KEYS.REVIEWS, reviews);
        resolve(newReview);
      });
    },

    // =========================================================================
    // ADMIN PANEL (A9)
    // Future Routes: GET/POST /Admin/Cars/*, /Admin/Orders/*, /Admin/Reviews/*
    // =========================================================================
    adminGetCars: function () {
      return new Promise(function (resolve) {
        var cars = getItem(STORAGE_KEYS.CARS, []).map(attachImages);
        resolve(cars);
      });
    },

    adminSaveCar: function (carData, isEdit) {
      return new Promise(function (resolve, reject) {
        var vin = String(carData.Vin || '').trim().toUpperCase();

        // 17 chars validation, no I, O, Q
        var vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        if (!vinRegex.test(vin)) {
          reject(new Error("Invalid VIN format. Must be exactly 17 characters without letters I, O, or Q."));
          return;
        }

        var cars = getItem(STORAGE_KEYS.CARS, []);
        var existingIdx = cars.findIndex(function (c) { return c.Vin === vin; });

        if (!isEdit && existingIdx !== -1) {
          reject(new Error("A vehicle with VIN " + vin + " already exists in inventory."));
          return;
        }

        var carRecord = {
          Vin: vin,
          Make: String(carData.Make || '').trim(),
          Model: String(carData.Model || '').trim(),
          Year: Number(carData.Year) || new Date().getFullYear(),
          Category: carData.Category || "Sports",
          Price: Number(carData.Price) || 0,
          Horsepower: Number(carData.Horsepower) || 0,
          Mileage: Number(carData.Mileage) || 0,
          Transmission: carData.Transmission || "Automatic",
          Fuel: carData.Fuel || "Petrol",
          EngineDescription: carData.EngineDescription || "",
          StockQuantity: Number(carData.StockQuantity) || 0,
          IsAvailable: Boolean(carData.IsAvailable),
          Description: carData.Description || ""
        };

        if (existingIdx !== -1) {
          cars[existingIdx] = carRecord;
        } else {
          cars.unshift(carRecord);
          // Register default images for newly added car
          var images = getItem(STORAGE_KEYS.CAR_IMAGES, []);
          var maxImgId = 0;
          images.forEach(function (m) { if (m.Id > maxImgId) maxImgId = m.Id; });
          for (var k = 1; k <= 4; k++) {
            images.push({
              Id: maxImgId + k,
              CarVin: vin,
              ImageUrl: '../assets/img/default-car.svg'
            });
          }
          setItem(STORAGE_KEYS.CAR_IMAGES, images);
        }

        setItem(STORAGE_KEYS.CARS, cars);
        resolve(attachImages(carRecord));
      });
    },

    adminDeleteCar: function (vin) {
      return new Promise(function (resolve) {
        var cars = getItem(STORAGE_KEYS.CARS, []);
        cars = cars.filter(function (c) { return c.Vin.toUpperCase() !== vin.toUpperCase(); });
        setItem(STORAGE_KEYS.CARS, cars);
        resolve(true);
      });
    },

    adminGetOrders: function () {
      return new Promise(function (resolve) {
        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        resolve(orders);
      });
    },

    adminUpdateOrderStatus: function (orderId, newStatus) {
      return new Promise(function (resolve, reject) {
        var validStatuses = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];
        if (validStatuses.indexOf(newStatus) === -1) {
          reject(new Error("Invalid order status: " + newStatus));
          return;
        }

        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        var order = orders.find(function (o) { return o.Id === Number(orderId); });
        if (!order) {
          reject(new Error("Order not found."));
          return;
        }

        order.Status = newStatus;
        setItem(STORAGE_KEYS.ORDERS, orders);
        resolve(order);
      });
    },

    adminGetReviews: function () {
      return new Promise(function (resolve) {
        var reviews = getItem(STORAGE_KEYS.REVIEWS, []);
        resolve(reviews);
      });
    },

    adminDeleteReview: function (reviewId) {
      return new Promise(function (resolve) {
        var reviews = getItem(STORAGE_KEYS.REVIEWS, []);
        reviews = reviews.filter(function (r) { return r.Id !== Number(reviewId); });
        setItem(STORAGE_KEYS.REVIEWS, reviews);
        resolve(true);
      });
    },

    adminGetMetrics: function () {
      return new Promise(function (resolve) {
        var orders = getItem(STORAGE_KEYS.ORDERS, []);
        var cars = getItem(STORAGE_KEYS.CARS, []);
        var reviews = getItem(STORAGE_KEYS.REVIEWS, []);

        var paidOrders = orders.filter(function (o) {
          return o.Status === "Paid" || o.Status === "Shipped" || o.Status === "Delivered";
        });

        var totalRevenue = paidOrders.reduce(function (sum, o) {
          return sum + Number(o.TotalAmount || 0);
        }, 0);

        var inStock = cars.filter(function (c) { return c.IsAvailable && c.StockQuantity > 0; }).length;

        var revSum = reviews.reduce(function (s, r) { return s + r.Rating; }, 0);
        var avgRating = reviews.length ? (revSum / reviews.length).toFixed(1) : "5.0";

        resolve({
          totalRevenue: totalRevenue,
          paidOrdersCount: paidOrders.length,
          totalOrdersCount: orders.length,
          carsInStock: inStock,
          totalCars: cars.length,
          averageRating: parseFloat(avgRating),
          recentOrders: orders.slice(0, 5)
        });
      });
    }

  };

  window.Api = Api;

})();

