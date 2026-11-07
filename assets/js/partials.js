/**
 * RF Prestige — Layout & Partials Injector
 * Mirrors ASP.NET Core MVC _Layout.cshtml.
 * Injects the unified luxury navbar, mobile offcanvas drawer, and footer.
 */

(function () {
  'use strict';

  function getRootPrefix() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var inSubfolder = /[\/\\](catalog|cart|checkout|account|wishlist|reviews|admin)[\/\\]/i.test(path);
    return inSubfolder ? '../' : './';
  }

  function getActiveNav() {
    var path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    if (path.indexOf('/catalog') !== -1) return 'catalog';
    if (path.indexOf('/wishlist') !== -1) return 'wishlist';
    if (path.indexOf('/reviews') !== -1) return 'reviews';
    if (path.indexOf('/cart') !== -1) return 'cart';
    if (path.indexOf('/admin') !== -1) return 'admin';
    if (path.indexOf('/account') !== -1) return 'account';
    return '';
  }

  function renderNavbar(root, active) {
    var user = window.Auth ? window.Auth.getCurrentUser() : null;
    var isAdmin = user && user.Role === 'Admin';

    var userMenuHtml = '';
    if (user) {
      userMenuHtml = '<div class="dropdown">' +
        '<button class="btn btn-outline-gold-subtle dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 rounded-pill" type="button" id="userMenuBtn" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-person-circle fs-5 text-gold"></i>' +
          '<span class="d-none d-sm-inline fw-medium text-light">' + window.UI.escapeHtml(user.FirstName) + '</span>' +
          (isAdmin ? '<span class="badge bg-gold text-dark ms-1 font-monospace" style="font-size:0.7rem;">ADMIN</span>' : '') +
        '</button>' +
        '<ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-charcoal border-gold shadow-lg py-2 mt-2" aria-labelledby="userMenuBtn" style="min-width: 220px;">' +
          '<li class="px-3 py-2 border-bottom border-secondary border-opacity-25">' +
            '<div class="fw-bold text-light">' + window.UI.escapeHtml(user.FirstName + ' ' + user.LastName) + '</div>' +
            '<div class="text-secondary small font-monospace">' + window.UI.escapeHtml(user.Email) + '</div>' +
          '</li>' +
          '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'account/orders.html"><i class="bi bi-box-seam text-gold"></i> Order History</a></li>' +
          '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'account/addresses.html"><i class="bi bi-geo-alt text-gold"></i> Saved Addresses</a></li>' +
          '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'wishlist/index.html"><i class="bi bi-heart text-gold"></i> Wishlist</a></li>' +
          (isAdmin ? '<li class="dropdown-divider border-secondary border-opacity-25"></li>' +
            '<li class="dropdown-header text-gold small text-uppercase tracking-wider">Administration</li>' +
            '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'admin/index.html"><i class="bi bi-speedometer2 text-gold"></i> Admin Dashboard</a></li>' +
            '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'admin/cars.html"><i class="bi bi-car-front text-gold"></i> Inventory & Cars</a></li>' +
            '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'admin/orders.html"><i class="bi bi-receipt text-gold"></i> Order Management</a></li>' +
            '<li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="' + root + 'admin/reviews.html"><i class="bi bi-chat-left-quote text-gold"></i> Site Reviews</a></li>' : '') +
          '<li class="dropdown-divider border-secondary border-opacity-25"></li>' +
          '<li><a class="dropdown-item py-2 text-danger d-flex align-items-center gap-2" href="#" id="rf-logout-link"><i class="bi bi-box-arrow-right"></i> Sign Out</a></li>' +
        '</ul>' +
      '</div>';
    } else {
      userMenuHtml = '<a href="' + root + 'account/login.html" class="btn btn-outline-gold btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2">' +
        '<i class="bi bi-person"></i> <span>Sign In</span>' +
      '</a>';
    }

    return '<nav class="navbar navbar-expand-lg navbar-dark bg-obsidian border-bottom border-gold-subtle sticky-top py-2 py-lg-3" id="rf-main-navbar">' +
      '<div class="container-fluid px-3 px-lg-5">' +
        '<!-- Brand Logo -->' +
        '<a class="navbar-brand d-flex align-items-center gap-2" href="' + root + 'catalog/index.html">' +
          '<img src="' + root + 'assets/img/rf-logo.svg" alt="RF Prestige" height="38" class="d-inline-block align-text-top" />' +
        '</a>' +

        '<!-- Mobile Toggle -->' +
        '<div class="d-flex align-items-center gap-2 d-lg-none flex-shrink-0">' +
          '<a href="' + root + 'cart/index.html" class="btn btn-link text-light position-relative p-2" aria-label="Cart">' +
            '<i class="bi bi-bag fs-5 text-gold"></i>' +
            '<span class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-gold text-dark font-monospace cart-count d-none">0</span>' +
          '</a>' +
          '<button class="navbar-toggler border-gold-subtle text-gold p-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#rf-mobile-menu" aria-controls="rf-mobile-menu" aria-label="Toggle navigation">' +
            '<i class="bi bi-list fs-4"></i>' +
          '</button>' +
        '</div>' +

        '<!-- Desktop Navigation Links -->' +
        '<div class="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="rf-desktop-nav">' +
          '<ul class="navbar-nav gap-lg-4">' +
            '<li class="nav-item">' +
              '<a class="nav-link text-uppercase tracking-wider px-2 ' + (active === 'catalog' ? 'active text-gold fw-bold' : '') + '" href="' + root + 'catalog/index.html">' +
                '<i class="bi bi-grid me-1"></i> Catalog' +
              '</a>' +
            '</li>' +
            '<li class="nav-item">' +
              '<a class="nav-link text-uppercase tracking-wider px-2 ' + (active === 'wishlist' ? 'active text-gold fw-bold' : '') + '" href="' + root + 'wishlist/index.html">' +
                '<i class="bi bi-heart me-1"></i> Wishlist ' +
                '<span class="badge bg-gold-subtle text-gold border border-gold-subtle rounded-pill wishlist-count d-none ms-1">0</span>' +
              '</a>' +
            '</li>' +
            '<li class="nav-item">' +
              '<a class="nav-link text-uppercase tracking-wider px-2 ' + (active === 'reviews' ? 'active text-gold fw-bold' : '') + '" href="' + root + 'reviews/index.html">' +
                '<i class="bi bi-chat-quote me-1"></i> Site Reviews' +
              '</a>' +
            '</li>' +
            (isAdmin ? '<li class="nav-item">' +
              '<a class="nav-link text-uppercase tracking-wider px-2 text-warning ' + (active === 'admin' ? 'active fw-bold' : '') + '" href="' + root + 'admin/index.html">' +
                '<i class="bi bi-shield-lock me-1"></i> Admin Portal' +
              '</a>' +
            '</li>' : '') +
          '</ul>' +
        '</div>' +

        '<!-- Right Action Buttons (Desktop) -->' +
        '<div class="d-none d-lg-flex align-items-center gap-3">' +
          '<!-- Cart Button -->' +
          '<a href="' + root + 'cart/index.html" class="btn btn-outline-secondary border-gold-subtle position-relative px-3 py-2 rounded-pill d-flex align-items-center gap-2 ' + (active === 'cart' ? 'border-gold' : '') + '">' +
            '<i class="bi bi-bag text-gold fs-6"></i>' +
            '<span class="small fw-semibold text-light">Cart</span>' +
            '<span class="badge rounded-pill bg-gold text-dark font-monospace cart-count d-none">0</span>' +
          '</a>' +
          '<!-- User Menu -->' +
          userMenuHtml +
        '</div>' +
      '</div>' +
    '</nav>' +

    '<!-- Mobile Offcanvas Menu -->' +
    '<div class="offcanvas offcanvas-end bg-obsidian text-light border-start border-gold-subtle" tabindex="-1" id="rf-mobile-menu" aria-labelledby="rfMobileMenuLabel">' +
      '<div class="offcanvas-header border-bottom border-secondary border-opacity-25 pb-3">' +
        '<div class="d-flex align-items-center gap-2">' +
          '<img src="' + root + 'assets/img/rf-logo.svg" alt="RF Prestige" height="32" />' +
        '</div>' +
        '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
      '</div>' +
      '<div class="offcanvas-body d-flex flex-column justify-content-between p-4">' +
        '<div class="nav flex-column gap-2">' +
          '<a class="nav-link py-2 fs-5 text-light ' + (active === 'catalog' ? 'text-gold fw-bold' : '') + '" href="' + root + 'catalog/index.html">' +
            '<i class="bi bi-grid text-gold me-2"></i> Vehicle Catalog' +
          '</a>' +
          '<a class="nav-link py-2 fs-5 text-light ' + (active === 'wishlist' ? 'text-gold fw-bold' : '') + '" href="' + root + 'wishlist/index.html">' +
            '<i class="bi bi-heart text-gold me-2"></i> Private Wishlist ' +
            '<span class="badge bg-gold text-dark rounded-pill wishlist-count d-none ms-1">0</span>' +
          '</a>' +
          '<a class="nav-link py-2 fs-5 text-light ' + (active === 'reviews' ? 'text-gold fw-bold' : '') + '" href="' + root + 'reviews/index.html">' +
            '<i class="bi bi-chat-quote text-gold me-2"></i> Site Reviews' +
          '</a>' +
          '<a class="nav-link py-2 fs-5 text-light ' + (active === 'cart' ? 'text-gold fw-bold' : '') + '" href="' + root + 'cart/index.html">' +
            '<i class="bi bi-bag text-gold me-2"></i> Shopping Cart ' +
            '<span class="badge bg-gold text-dark rounded-pill cart-count d-none ms-1">0</span>' +
          '</a>' +
          (isAdmin ? '<div class="border-top border-secondary border-opacity-25 my-2 pt-2"></div>' +
            '<div class="text-gold small text-uppercase tracking-wider fw-bold mb-2">Back-Office Administration</div>' +
            '<a class="nav-link py-2 text-light" href="' + root + 'admin/index.html"><i class="bi bi-speedometer2 text-gold me-2"></i> Metrics & Sales</a>' +
            '<a class="nav-link py-2 text-light" href="' + root + 'admin/cars.html"><i class="bi bi-car-front text-gold me-2"></i> Car Inventory</a>' +
            '<a class="nav-link py-2 text-light" href="' + root + 'admin/orders.html"><i class="bi bi-receipt text-gold me-2"></i> Orders & Shipping</a>' +
            '<a class="nav-link py-2 text-light" href="' + root + 'admin/reviews.html"><i class="bi bi-chat-left-quote text-gold me-2"></i> Review Moderation</a>' : '') +
          '<div class="border-top border-secondary border-opacity-25 my-2 pt-2"></div>' +
          (user ? '<div class="text-gold small text-uppercase tracking-wider fw-bold mb-2">Client Account</div>' +
            '<a class="nav-link py-2 text-light" href="' + root + 'account/orders.html"><i class="bi bi-box-seam text-gold me-2"></i> Order History</a>' +
            '<a class="nav-link py-2 text-light" href="' + root + 'account/addresses.html"><i class="bi bi-geo-alt text-gold me-2"></i> Saved Addresses</a>' +
            '<a class="nav-link py-2 text-danger" href="#" id="rf-mobile-logout"><i class="bi bi-box-arrow-right me-2"></i> Sign Out (' + window.UI.escapeHtml(user.FirstName) + ')</a>' :
            '<a class="btn btn-gold w-100 py-2 mt-2" href="' + root + 'account/login.html"><i class="bi bi-person me-2"></i> Sign In to Account</a>') +
        '</div>' +
        '<div class="border-top border-secondary border-opacity-25 pt-3 mt-4 text-center text-secondary small">' +
          '<div class="text-gold font-serif mb-1">RF PRESTIGE MOTORS</div>' +
          '<div>Calea Floreasca 169A, Bucharest</div>' +
          '<div class="font-monospace mt-1">+40 21 987 6543</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderFooter(root) {
    return '<footer class="bg-obsidian border-top border-gold-subtle pt-5 pb-3 text-secondary" id="rf-main-footer">' +
      '<div class="container px-4 px-lg-5">' +
        '<div class="row g-4 mb-5">' +
          '<!-- Col 1: Brand Info -->' +
          '<div class="col-12 col-lg-4 col-md-6">' +
            '<img src="' + root + 'assets/img/rf-logo.svg" alt="RF Prestige" height="40" class="mb-3" />' +
            '<p class="small text-secondary lh-lg mb-3">' +
              'RF Prestige is Romania\'s premier automotive boutique specializing in verified, certified pre-owned supercars, grand tourers, and luxury vehicles. Every automobile is curated with transparent provenance and factory certification.' +
            '</p>' +
            '<div class="d-flex align-items-center gap-3 text-gold fs-5">' +
              '<a href="#" class="text-gold text-decoration-none" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
              '<a href="#" class="text-gold text-decoration-none" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
              '<a href="#" class="text-gold text-decoration-none" aria-label="YouTube"><i class="bi bi-youtube"></i></a>' +
              '<a href="#" class="text-gold text-decoration-none" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>' +
            '</div>' +
          '</div>' +

          '<!-- Col 2: Quick Links -->' +
          '<div class="col-6 col-lg-2 col-md-6">' +
            '<h6 class="text-gold text-uppercase tracking-wider font-sans fw-bold mb-3 small">Collections</h6>' +
            '<ul class="list-unstyled small d-flex flex-column gap-2 mb-0">' +
              '<li><a href="' + root + 'catalog/index.html?category=Sports" class="text-secondary text-decoration-none hover-gold">Sports Cars</a></li>' +
              '<li><a href="' + root + 'catalog/index.html?category=Grand+Tourer" class="text-secondary text-decoration-none hover-gold">Grand Tourers</a></li>' +
              '<li><a href="' + root + 'catalog/index.html?category=Luxury+Sedan" class="text-secondary text-decoration-none hover-gold">Luxury Sedans</a></li>' +
              '<li><a href="' + root + 'catalog/index.html?category=SUV" class="text-secondary text-decoration-none hover-gold">Performance SUVs</a></li>' +
              '<li><a href="' + root + 'catalog/index.html" class="text-secondary text-decoration-none hover-gold">Complete Inventory</a></li>' +
            '</ul>' +
          '</div>' +

          '<!-- Col 3: Client Services -->' +
          '<div class="col-6 col-lg-3 col-md-6">' +
            '<h6 class="text-gold text-uppercase tracking-wider font-sans fw-bold mb-3 small">Client Concierge</h6>' +
            '<ul class="list-unstyled small d-flex flex-column gap-2 mb-0">' +
              '<li><a href="' + root + 'wishlist/index.html" class="text-secondary text-decoration-none hover-gold">Private Wishlist (B2)</a></li>' +
              '<li><a href="' + root + 'reviews/index.html" class="text-secondary text-decoration-none hover-gold">Client Reviews (B7)</a></li>' +
              '<li><a href="' + root + 'account/orders.html" class="text-secondary text-decoration-none hover-gold">Order History & Invoices</a></li>' +
              '<li><a href="' + root + 'account/addresses.html" class="text-secondary text-decoration-none hover-gold">Delivery Addresses</a></li>' +
              '<li><a href="' + root + 'admin/index.html" class="text-gold text-decoration-none hover-gold"><i class="bi bi-shield-check me-1"></i> Admin Portal</a></li>' +
            '</ul>' +
          '</div>' +

          '<!-- Col 4: Showroom & Hours -->' +
          '<div class="col-12 col-lg-3 col-md-6">' +
            '<h6 class="text-gold text-uppercase tracking-wider font-sans fw-bold mb-3 small">Bucharest Boutique</h6>' +
            '<div class="small text-secondary mb-2">' +
              '<i class="bi bi-geo-alt text-gold me-2"></i> Calea Floreasca 169A, Sector 1, Bucharest, Romania' +
            '</div>' +
            '<div class="small text-secondary mb-2">' +
              '<i class="bi bi-telephone text-gold me-2"></i> <span class="font-monospace">+40 21 987 6543</span>' +
            '</div>' +
            '<div class="small text-secondary mb-2">' +
              '<i class="bi bi-envelope text-gold me-2"></i> concierge@rfprestige.ro' +
            '</div>' +
            '<div class="small text-secondary mt-3 p-2 bg-dark-alt rounded border border-secondary border-opacity-25">' +
              '<i class="bi bi-clock text-gold me-1"></i> Mon–Fri: 09:00–19:00 | Sat: 10:00–15:00' +
              '<div class="text-gold-subtle" style="font-size:0.75rem;">Private viewings arranged upon request</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<!-- Prototype Ribbon Banner -->' +
        '<div class="p-3 mb-4 rounded-3 bg-dark-alt border border-gold-subtle d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">' +
          '<div class="d-flex align-items-center gap-2 text-start">' +
            '<span class="badge bg-gold text-dark font-monospace text-uppercase px-2 py-1">PROTOTYPE</span>' +
            '<span class="small text-light">' +
              'Mock data active (localStorage). ASP.NET Core MVC &amp; EF Core compatible frontend architecture.' +
            '</span>' +
          '</div>' +
          '<div class="d-flex align-items-center gap-3">' +
            '<button type="button" class="btn btn-outline-gold btn-sm px-3" id="rf-reset-demo-btn">' +
              '<i class="bi bi-arrow-counterclockwise me-1"></i> Reset Demo Data' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<!-- Bottom Copyright -->' +
        '<div class="d-flex flex-column flex-md-row align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25 small text-secondary gap-2">' +
          '<div>&copy; 2026 RF Prestige Motors S.R.L. All Rights Reserved. Prepared by Cătălinoiu L. Roberto &amp; Țicleanu Ș. Alexandru.</div>' +
          '<div class="d-flex gap-3">' +
            '<span>Target: Romania (€60,000–€250,000)</span>' +
            '<span>•</span>' +
            '<span>Stripe Sandbox Ready</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  function initPartials() {
    var root = getRootPrefix();
    var active = getActiveNav();

    // 1. Inject Navbar
    var navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = renderNavbar(root, active);
    }

    // 2. Inject Footer
    var footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = renderFooter(root);
    }

    // 3. Attach Logout handlers
    var logoutLink = document.getElementById('rf-logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.Auth.logout().then(function () {
          window.UI.showToast("You have been signed out.", "info");
          setTimeout(function () {
            window.location.reload();
          }, 600);
        });
      });
    }

    var mobileLogout = document.getElementById('rf-mobile-logout');
    if (mobileLogout) {
      mobileLogout.addEventListener('click', function (e) {
        e.preventDefault();
        window.Auth.logout().then(function () {
          window.location.reload();
        });
      });
    }

    // 4. Attach Reset Demo Data handler
    var resetBtn = document.getElementById('rf-reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm("Reset all prototype data to the initial catalog, users, addresses, and orders?")) {
          window.Api.resetDemoData().then(function () {
            alert("Prototype data restored to factory seed state.");
            window.location.reload();
          });
        }
      });
    }

    // 5. Update Cart & Wishlist badges if scripts are loaded
    if (window.Cart && window.Cart.updateBadges) window.Cart.updateBadges();
    if (window.Wishlist && window.Wishlist.updateBadges) window.Wishlist.updateBadges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPartials);
  } else {
    initPartials();
  }

  window.addEventListener('rf:auth-change', function () {
    var root = getRootPrefix();
    var active = getActiveNav();
    var navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = renderNavbar(root, active);
      var logoutLink = document.getElementById('rf-logout-link');
      if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
          e.preventDefault();
          window.Auth.logout().then(function () {
            window.location.reload();
          });
        });
      }
    }
  });

})();
