/**
 * RF Prestige — Seed Mock Data
 * Entity definitions exactly matching ASP.NET Core MVC / EF Core schema.
 * Exposed as window.MockData.
 */

(function () {
  'use strict';

  var users = [
    {
      Id: "usr-cust-001",
      Email: "customer@rfprestige.ro",
      PasswordHash: "Demo123!",
      FirstName: "John",
      LastName: "Doe",
      Role: "Customer"
    },
    {
      Id: "usr-admin-001",
      Email: "admin@rfprestige.ro",
      PasswordHash: "Admin123!",
      FirstName: "Roberto",
      LastName: "Admin",
      Role: "Admin"
    }
  ];

  var addresses = [
    {
      Id: 1,
      UserId: "usr-cust-001",
      Street: "Str. Aviatorilor 12",
      City: "Bucharest",
      County: "București",
      PostalCode: "011861",
      Country: "Romania",
      IsDefault: true
    },
    {
      Id: 2,
      UserId: "usr-cust-001",
      Street: "Bd. Eroilor 5",
      City: "Cluj-Napoca",
      County: "Cluj",
      PostalCode: "400129",
      Country: "Romania",
      IsDefault: false
    }
  ];

  var cars = [
    // --- SPORTS (8 CARS) ---
    {
      Vin: "WP0ZZZ99ZPS291047",
      Make: "Porsche",
      Model: "911 GT3",
      Year: 2023,
      Category: "Sports",
      Price: 215000,
      Horsepower: 510,
      Mileage: 4200,
      Transmission: "7-Speed PDK",
      Fuel: "Petrol",
      EngineDescription: "4.0L Naturally Aspirated Flat-6",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Finished in Shark Blue with Clubsport Package, carbon bucket seats, carbon ceramic brakes (PCCB), front-axle lift system, and lightweight carbon roof. Single owner, full Porsche Centre Bucharest service history, factory warranty active."
    },
    {
      Vin: "ZFF92LLA9N0267841",
      Make: "Ferrari",
      Model: "F8 Tributo",
      Year: 2022,
      Category: "Sports",
      Price: 248000,
      Horsepower: 720,
      Mileage: 1800,
      Transmission: "7-Speed F1 Dual-Clutch",
      Fuel: "Petrol",
      EngineDescription: "3.9L Twin-Turbo V8",
      StockQuantity: 0,
      IsAvailable: false,
      Description: "Rosso Corsa over Nero leather with Giallo stitching. Equipped with carbon fiber racing seats, passenger display, Scuderia fender shields, and titanium exhaust pipes. Official Ferrari Power15 warranty included."
    },
    {
      Vin: "SBM14ABA8MW005128",
      Make: "McLaren",
      Model: "720S Performance",
      Year: 2021,
      Category: "Sports",
      Price: 229000,
      Horsepower: 720,
      Mileage: 6400,
      Transmission: "7-Speed SSG",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Papaya Spark exterior with full Carbon Fiber Exterior Upgrade Packs 1, 2, and 3. Bowers & Wilkins 12-speaker audio, 360-degree park assist, sports exhaust, and McLaren Qualified warranty."
    },
    {
      Vin: "ZHWEF4ZF4NLA14290",
      Make: "Lamborghini",
      Model: "Huracán EVO",
      Year: 2022,
      Category: "Sports",
      Price: 235000,
      Horsepower: 640,
      Mileage: 5100,
      Transmission: "7-Speed LDF Dual-Clutch",
      Fuel: "Petrol",
      EngineDescription: "5.2L Naturally Aspirated V10",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Verde Mantis pearl finish with matching Q-Citura hexagonal stitching on Alcantara. Equipped with LDVI active dynamics, magnetorheological suspension, dynamic steering, and transparent engine cover."
    },
    {
      Vin: "1G1YB2D37P5604812",
      Make: "Chevrolet",
      Model: "Corvette Z06",
      Year: 2023,
      Category: "Sports",
      Price: 145000,
      Horsepower: 670,
      Mileage: 2900,
      Transmission: "8-Speed Dual-Clutch",
      Fuel: "Petrol",
      EngineDescription: "5.5L Flat-Plane Crank LT6 V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Accelerate Yellow Metallic with carbon ground effects aero package, Level 2 carbon interior trim, competition sport seats, and performance data recorder. European homologated."
    },
    {
      Vin: "WDD1903791A083145",
      Make: "Mercedes-AMG",
      Model: "GT R PRO",
      Year: 2021,
      Category: "Sports",
      Price: 188000,
      Horsepower: 585,
      Mileage: 8300,
      Transmission: "7-Speed AMG SPEEDSHIFT",
      Fuel: "Petrol",
      EngineDescription: "4.0L Biturbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "AMG Green Hell Magno with track package, ceramic high-performance compound brake system, carbon bucket seats with 4-point harnesses, and adjustable coilover suspension."
    },
    {
      Vin: "ZAM85VMA8PX398214",
      Make: "Maserati",
      Model: "MC20 Cielo",
      Year: 2023,
      Category: "Sports",
      Price: 242000,
      Horsepower: 630,
      Mileage: 1200,
      Transmission: "8-Speed Dual-Clutch",
      Fuel: "Petrol",
      EngineDescription: "3.0L Nettuno Twin-Turbo V6",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Acquamarina three-layer paint with smart electrochromic glass roof, carbon interior package, Sonus Faber high-premium sound system, and Formula 1 pre-chamber combustion technology."
    },
    {
      Vin: "SCFRMFAW7N8M02841",
      Make: "Aston Martin",
      Model: "Vantage F1 Edition",
      Year: 2022,
      Category: "Sports",
      Price: 168000,
      Horsepower: 535,
      Mileage: 4900,
      Transmission: "8-Speed ZF Automatic",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 0,
      IsAvailable: false,
      Description: "Aston Martin Racing Green in satin finish with bespoke aerodynamic kit producing 200kg of downforce. Carbon bucket seats, 21-inch satin black wheels, and verified low mileage."
    },

    // --- GRAND TOURER (8 CARS) ---
    {
      Vin: "SCBDG4ZG4NC087412",
      Make: "Bentley",
      Model: "Continental GT V8",
      Year: 2022,
      Category: "Grand Tourer",
      Price: 218000,
      Horsepower: 550,
      Mileage: 7400,
      Transmission: "8-Speed Dual-Clutch",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Anthracite Metallic with Mulliner Driving Specification, Linen and Beluga hides with diamond-in-diamond quilting, Bentley Rotating Display, Naim for Bentley 2,200W sound system."
    },
    {
      Vin: "ZFF94LHA1P0281945",
      Make: "Ferrari",
      Model: "Roma",
      Year: 2023,
      Category: "Grand Tourer",
      Price: 225000,
      Horsepower: 620,
      Mileage: 3500,
      Transmission: "8-Speed F1 Dual-Clutch",
      Fuel: "Petrol",
      EngineDescription: "3.9L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Grigio Silverstone with Cuoio full leather interior, Magneride dual-mode suspension, ADAS full package, surround view cameras, and ventilated electric memory seats."
    },
    {
      Vin: "SCFEAHAW6NC012785",
      Make: "Aston Martin",
      Model: "DB11 V8 Volante",
      Year: 2022,
      Category: "Grand Tourer",
      Price: 179000,
      Horsepower: 535,
      Mileage: 9200,
      Transmission: "8-Speed Automatic",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Onyx Black with Chancellor Red leather interior, 8-layer acoustically insulated fabric hood, piano black fascia trim, Nexus quilting, and 360-degree camera system."
    },
    {
      Vin: "WP0ZZZ99ZPS283719",
      Make: "Porsche",
      Model: "911 Turbo S",
      Year: 2023,
      Category: "Grand Tourer",
      Price: 249000,
      Horsepower: 650,
      Mileage: 2100,
      Transmission: "8-Speed PDK",
      Fuel: "Petrol",
      EngineDescription: "3.8L Twin-Turbo Flat-6",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Agate Grey Metallic, Burmester High-End Surround Sound, Porsche Ceramic Composite Brake (PCCB) with calipers in high gloss black, sports exhaust system with silver tailpipes, PDCC active roll stabilization."
    },
    {
      Vin: "WBAAE0C05MCH18924",
      Make: "BMW",
      Model: "M8 Competition Coupé",
      Year: 2021,
      Category: "Grand Tourer",
      Price: 112000,
      Horsepower: 625,
      Mileage: 18500,
      Transmission: "8-Speed M Steptronic",
      Fuel: "Petrol",
      EngineDescription: "4.4L M TwinPower Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Marina Bay Blue Metallic, M Carbon exterior package, Bowers & Wilkins Diamond surround sound, M Carbon ceramic brakes, M Drivers package with 305 km/h top speed delimiter."
    },
    {
      Vin: "W1K2324871F019283",
      Make: "Mercedes-AMG",
      Model: "SL 63 4MATIC+",
      Year: 2022,
      Category: "Grand Tourer",
      Price: 184000,
      Horsepower: 585,
      Mileage: 6800,
      Transmission: "9-Speed AMG SPEEDSHIFT MCT",
      Fuel: "Petrol",
      EngineDescription: "4.0L Biturbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "MANUFAKTUR Alpine Grey solid, AMG Night Package II, AMG DYNAMIC PLUS package with rear-axle steering, AIRSCARF neck-level heating, Burmester 3D Surround Sound."
    },
    {
      Vin: "JTHHP5AY5MA009842",
      Make: "Lexus",
      Model: "LC 500 Sport+",
      Year: 2021,
      Category: "Grand Tourer",
      Price: 78000,
      Horsepower: 477,
      Mileage: 22000,
      Transmission: "10-Speed Direct-Shift",
      Fuel: "Petrol",
      EngineDescription: "5.0L Naturally Aspirated V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Sonic Amber with Dark Rose Alcantara upholstery, carbon fiber roof and active rear spoiler, Lexus Dynamic Handling with 4-wheel active steering, Mark Levinson 13-speaker audio."
    },
    {
      Vin: "ZAM45RMA1L0382914",
      Make: "Maserati",
      Model: "GranTurismo MC",
      Year: 2020,
      Category: "Grand Tourer",
      Price: 84000,
      Horsepower: 460,
      Mileage: 28000,
      Transmission: "6-Speed ZF Automatic",
      Fuel: "Petrol",
      EngineDescription: "4.7L Naturally Aspirated Ferrari V8",
      StockQuantity: 0,
      IsAvailable: false,
      Description: "Bianco Fuji pearlescent paint, carbon fiber bonnet and aerodynamic package, Nero leather/Alcantara with Rosso stitching, legendary Ferrari-engineered exhaust note."
    },

    // --- LUXURY SEDAN (8 CARS) ---
    {
      Vin: "WP0ZZZ97ZNL189423",
      Make: "Porsche",
      Model: "Panamera Turbo S",
      Year: 2022,
      Category: "Luxury Sedan",
      Price: 175000,
      Horsepower: 700,
      Mileage: 11400,
      Transmission: "8-Speed PDK",
      Fuel: "Hybrid",
      EngineDescription: "4.0L Biturbo V8 + Electric Motor E-Hybrid",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Night Blue Metallic, full natural leather in Saddle Brown, 21-inch Exclusive Design wheels, Porsche Ceramic Composite Brake (PCCB), night vision assist, panoramic roof system."
    },
    {
      Vin: "W1K2231761A058291",
      Make: "Mercedes-Maybach",
      Model: "S 580 4MATIC",
      Year: 2022,
      Category: "Luxury Sedan",
      Price: 198000,
      Horsepower: 503,
      Mileage: 14200,
      Transmission: "9-Speed 9G-TRONIC",
      Fuel: "Hybrid",
      EngineDescription: "4.0L Biturbo V8 Mild-Hybrid EQ Boost",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Two-tone Obsidian Black over Kalahari Gold, First-Class rear compartment with folding tables, champagne flutes, refrigerator, Burmester High-End 4D sound, active ambient lighting."
    },
    {
      Vin: "WAUZZZF28PA082194",
      Make: "Audi",
      Model: "RS6 Avant Vorsprung",
      Year: 2023,
      Category: "Luxury Sedan",
      Price: 142000,
      Horsepower: 600,
      Mileage: 16300,
      Transmission: "8-Speed Tiptronic",
      Fuel: "Hybrid",
      EngineDescription: "4.0L Twin-Turbo TFSI V8 Mild-Hybrid",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Daytona Grey Matte, Vorsprung top-tier specification, HD Matrix LED headlights with Audi laser light, RS sport exhaust system, Bang & Olufsen Advanced 3D Sound, all-wheel steering."
    },
    {
      Vin: "WBS33CH07NCB48219",
      Make: "BMW",
      Model: "M5 CS Edition",
      Year: 2022,
      Category: "Luxury Sedan",
      Price: 169000,
      Horsepower: 635,
      Mileage: 8900,
      Transmission: "8-Speed M Steptronic",
      Fuel: "Petrol",
      EngineDescription: "4.4L M TwinPower Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Frozen Deep Green Metallic with Gold Bronze accents and yellow daytime running lights. 1 of 1,000 limited units worldwide. Carbon bucket seats with Nürburgring track map debossed on headrests."
    },
    {
      Vin: "SCA664S59MUX82149",
      Make: "Rolls-Royce",
      Model: "Ghost Extended",
      Year: 2021,
      Category: "Luxury Sedan",
      Price: 249500,
      Horsepower: 571,
      Mileage: 9800,
      Transmission: "8-Speed Satellite Aided",
      Fuel: "Petrol",
      EngineDescription: "6.75L Twin-Turbo V12",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Diamond Black with Grace White and Mandarin bespoke interior, Shooting Star Starlight Headliner, Planar Suspension System, illuminated fascia, rear theater configuration."
    },
    {
      Vin: "SCBDH4ZG8PC098231",
      Make: "Bentley",
      Model: "Flying Spur Azure",
      Year: 2023,
      Category: "Luxury Sedan",
      Price: 228000,
      Horsepower: 544,
      Mileage: 4700,
      Transmission: "8-Speed Dual-Clutch",
      Fuel: "Hybrid",
      EngineDescription: "2.9L Twin-Turbo V6 + E-Motor Hybrid",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Portofino Blue with Portland and Imperial Blue hide, Azure wellness specification with massage and climate-controlled seating, Flying B mascot in bright finish with illuminated wings."
    },
    {
      Vin: "WAUZZZF25NA049218",
      Make: "Audi",
      Model: "RS7 Sportback",
      Year: 2022,
      Category: "Luxury Sedan",
      Price: 129000,
      Horsepower: 630,
      Mileage: 19100,
      Transmission: "8-Speed Tiptronic",
      Fuel: "Hybrid",
      EngineDescription: "4.0L TFSI Twin-Turbo V8 Mild-Hybrid",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Nardo Grey, Gloss Carbon styling package, RS ceramic brakes with blue calipers, RS Dynamic package plus (top speed 305 km/h), heads-up display, Audi virtual cockpit plus."
    },
    {
      Vin: "W1K2130891A928174",
      Make: "Mercedes-AMG",
      Model: "E 63 S Final Edition",
      Year: 2021,
      Category: "Luxury Sedan",
      Price: 118000,
      Horsepower: 612,
      Mileage: 24500,
      Transmission: "9-Speed AMG SPEEDSHIFT MCT",
      Fuel: "Petrol",
      EngineDescription: "4.0L Biturbo V8",
      StockQuantity: 0,
      IsAvailable: false,
      Description: "MANUFAKTUR Graphite Grey Magno, AMG Ceramic High-Performance braking system, AMG Performance seats in titanium grey pearl, carbon exterior mirror housings and boot lip."
    },

    // --- SUV (8 CARS) ---
    {
      Vin: "SCFEAUBW7P8M04912",
      Make: "Aston Martin",
      Model: "DBX707",
      Year: 2023,
      Category: "SUV",
      Price: 239000,
      Horsepower: 707,
      Mileage: 3200,
      Transmission: "9-Speed Wet-Clutch",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Apex Grey exterior with semi-aniline leather interior in Electron Yellow and Onyx Black. Carbon ceramic brakes with bronze calipers, 23-inch forged textured wheels, sports exhaust with quad active bypass valves."
    },
    {
      Vin: "ZPBUA1ZL8NLA82914",
      Make: "Lamborghini",
      Model: "Urus Performante",
      Year: 2022,
      Category: "SUV",
      Price: 249000,
      Horsepower: 666,
      Mileage: 6100,
      Transmission: "8-Speed Automatic",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Giallo Auge with visible carbon fiber bonnet, roof and rear spoiler. Akrapovic titanium exhaust system, full ADAS package with head-up display, 23-inch Pelope diamond-cut rims."
    },
    {
      Vin: "WP1ZZZ9YZPDA82149",
      Make: "Porsche",
      Model: "Cayenne Turbo GT",
      Year: 2023,
      Category: "SUV",
      Price: 212000,
      Horsepower: 659,
      Mileage: 5400,
      Transmission: "8-Speed Tiptronic S",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Arctic Grey with Neodyme gold 22-inch GT Design wheels, titanium central exhaust system, carbon roof, PCCB ceramic brakes, interior trim in lightweight Alcantara."
    },
    {
      Vin: "SALWK2EX5NA829140",
      Make: "Land Rover",
      Model: "Range Rover SV LWB",
      Year: 2022,
      Category: "SUV",
      Price: 225000,
      Horsepower: 530,
      Mileage: 8700,
      Transmission: "8-Speed Automatic",
      Fuel: "Petrol",
      EngineDescription: "4.4L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "SV Serenity theme with Corinthian Bronze accents over Caraway and Perlino semi-aniline leather. SV Signature Suite 4-seat configuration with electrically deployable club table and refrigerator."
    },
    {
      Vin: "SCBDH4ZG2MC048192",
      Make: "Bentley",
      Model: "Bentayga V8 First Edition",
      Year: 2021,
      Category: "SUV",
      Price: 182000,
      Horsepower: 550,
      Mileage: 19800,
      Transmission: "8-Speed Automatic",
      Fuel: "Petrol",
      EngineDescription: "4.0L Twin-Turbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Glacier White with Blackline Specification, Saddle leather with contrast stitching, touring specification with head-up display and night vision, Naim for Bentley 1,780W premium audio."
    },
    {
      Vin: "W1N4632761X391824",
      Make: "Mercedes-AMG",
      Model: "G 63 Magno Edition",
      Year: 2022,
      Category: "SUV",
      Price: 229000,
      Horsepower: 585,
      Mileage: 11200,
      Transmission: "9-Speed AMG SPEEDSHIFT",
      Fuel: "Petrol",
      EngineDescription: "4.0L Biturbo V8",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "MANUFAKTUR Night Black Magno with AMG Night Package, 22-inch cross-spoke forged wheels in matte black, Superior Line interior with diamond-quilted designo nappa leather, Burmester surround sound."
    },
    {
      Vin: "5YMJU0C07P9B82914",
      Make: "BMW",
      Model: "X5 M Competition",
      Year: 2023,
      Category: "SUV",
      Price: 138000,
      Horsepower: 625,
      Mileage: 12300,
      Transmission: "8-Speed M Steptronic",
      Fuel: "Hybrid",
      EngineDescription: "4.4L M TwinPower Turbo V8 Mild-Hybrid",
      StockQuantity: 1,
      IsAvailable: true,
      Description: "Isle of Man Green Metallic with Silverstone full Merino leather, Bowers & Wilkins Diamond surround sound system, M compound brakes in high-gloss red, Sky Lounge panoramic glass roof."
    },
    {
      Vin: "WAUZZZF17MA039184",
      Make: "Audi",
      Model: "RS Q8 Carbon Black",
      Year: 2021,
      Category: "SUV",
      Price: 126000,
      Horsepower: 600,
      Mileage: 21400,
      Transmission: "8-Speed Tiptronic",
      Fuel: "Hybrid",
      EngineDescription: "4.0L TFSI Twin-Turbo V8 Mild-Hybrid",
      StockQuantity: 0,
      IsAvailable: false,
      Description: "Orca Black Metallic, Carbon Black edition with carbon styling pack, sports exhaust system, electromechanical active roll stabilization (eAWS), panoramic sunroof."
    }
  ];

  // Build CarImage records (4 images per car)
  var carImages = [];
  var imgId = 1;
  cars.forEach(function (car) {
    for (var i = 1; i <= 4; i++) {
      carImages.push({
        Id: imgId++,
        CarVin: car.Vin,
        ImageUrl: "../assets/img/" + car.Vin + "-" + i + ".svg"
      });
    }
  });

  var orders = [
    {
      Id: 1042,
      UserId: "usr-cust-001",
      CustomerName: "John Doe",
      CustomerEmail: "customer@rfprestige.ro",
      ShippingAddressId: 1,
      ShippingAddressText: "Str. Aviatorilor 12, Bucharest, București 011861, Romania",
      TotalAmount: 215490,
      Status: "Paid",
      StripePaymentIntentId: "pi_mock_1O9s8d9f12345",
      DeliveryOption: 1, // 1 = Enclosed Trailer (+EUR 490)
      CreatedAt: "2026-10-28T14:30:00Z",
      Items: [
        {
          Id: 201,
          OrderId: 1042,
          CarVin: "WP0ZZZ99ZPS291047",
          UnitPrice: 215000,
          VehicleTitle: "2023 Porsche 911 GT3"
        }
      ]
    },
    {
      Id: 1041,
      UserId: "usr-cust-001",
      CustomerName: "John Doe",
      CustomerEmail: "customer@rfprestige.ro",
      ShippingAddressId: 2,
      ShippingAddressText: "Bd. Eroilor 5, Cluj-Napoca, Cluj 400129, Romania",
      TotalAmount: 168000,
      Status: "Delivered",
      StripePaymentIntentId: "pi_mock_98234abcfed",
      DeliveryOption: 0, // 0 = Showroom Pickup (EUR 0)
      CreatedAt: "2026-09-14T10:15:00Z",
      Items: [
        {
          Id: 200,
          OrderId: 1041,
          CarVin: "SCFRMFAW7N8M02841",
          UnitPrice: 168000,
          VehicleTitle: "2022 Aston Martin Vantage F1 Edition"
        }
      ]
    },
    {
      Id: 1043,
      UserId: "usr-cust-001",
      CustomerName: "Ana Popescu",
      CustomerEmail: "ana@mail.ro",
      ShippingAddressId: 2,
      ShippingAddressText: "Bd. Eroilor 5, Cluj-Napoca, Cluj 400129, Romania",
      TotalAmount: 248000,
      Status: "Pending",
      StripePaymentIntentId: "pi_mock_55182903bbca",
      DeliveryOption: 0,
      CreatedAt: "2026-11-04T16:45:00Z",
      Items: [
        {
          Id: 202,
          OrderId: 1043,
          CarVin: "ZFF92LLA9N0267841",
          UnitPrice: 248000,
          VehicleTitle: "2022 Ferrari F8 Tributo"
        }
      ]
    }
  ];

  var wishlistItems = [
    {
      Id: 1,
      UserId: "usr-cust-001",
      CarVin: "WP0ZZZ99ZPS291047",
      AddedAt: "2026-10-30T09:12:00Z"
    },
    {
      Id: 2,
      UserId: "usr-cust-001",
      CarVin: "ZFF92LLA9N0267841",
      AddedAt: "2026-11-02T11:45:00Z"
    },
    {
      Id: 3,
      UserId: "usr-cust-001",
      CarVin: "SCBDG4ZG4NC087412",
      AddedAt: "2026-11-05T17:20:00Z"
    }
  ];

  var siteReviews = [
    {
      Id: 1,
      UserId: "usr-cust-001",
      UserName: "Andrei M.",
      Rating: 5,
      Comment: "Smooth purchase, the car matched its description perfectly. The enclosed trailer delivery arrived in pristine condition right outside my office in Pipera.",
      CreatedAt: "2026-11-01T14:20:00Z"
    },
    {
      Id: 2,
      UserId: "usr-cust-002",
      UserName: "Ioana P.",
      Rating: 4,
      Comment: "Great selection of pristine supercars. Inspection report was exhaustive. Delivery took two days longer than estimated, but the team communicated proactively throughout.",
      CreatedAt: "2026-11-03T11:05:00Z"
    },
    {
      Id: 3,
      UserId: "usr-cust-003",
      UserName: "Radu D.",
      Rating: 5,
      Comment: "Unmatched level of professionalism in Romania. Acquired the Bentley Continental GT; the concierge service handled all registration documents in record time.",
      CreatedAt: "2026-10-25T08:30:00Z"
    },
    {
      Id: 4,
      UserId: "usr-cust-004",
      UserName: "Constantin V.",
      Rating: 5,
      Comment: "The VIN verification system provides immense peace of mind when transacting over €150k. My Porsche Turbo S drives like it just rolled out of Zuffenhausen.",
      CreatedAt: "2026-10-18T16:50:00Z"
    },
    {
      Id: 5,
      UserId: "usr-cust-005",
      UserName: "Mihai B.",
      Rating: 4,
      Comment: "Very transparent pricing without hidden dealer surcharges. Showroom pickup in Bucharest was an enjoyable VIP experience.",
      CreatedAt: "2026-10-09T13:10:00Z"
    },
    {
      Id: 6,
      UserId: "usr-cust-006",
      UserName: "Elena T.",
      Rating: 5,
      Comment: "Flawless acquisition of our family Range Rover SV. RF Prestige sets a new benchmark for luxury automotive retail in Southeast Europe.",
      CreatedAt: "2026-09-29T10:00:00Z"
    }
  ];

  window.MockData = {
    Users: users,
    Addresses: addresses,
    Cars: cars,
    CarImages: carImages,
    Orders: orders,
    WishlistItems: wishlistItems,
    SiteReviews: siteReviews
  };

})();

