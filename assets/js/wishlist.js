/**
 * RF Prestige — Wishlist / Favorites State & AJAX Toggles (Bonus B2)
 * Unique bookmarking pair: UserId + CarVin
 */

(function () {
  'use strict';

  function updateBadges() {
    if (!window.Api || !window.Auth) return;
    var user = window.Auth.getCurrentUser();
    if (!user) {
      document.querySelectorAll('.wishlist-count').forEach(function (el) {
        el.textContent = '0';
        el.classList.add('d-none');
      });
      return;
    }

    window.Api.getWishlist(user.Id).then(function (items) {
      var count = items.length;
      document.querySelectorAll('.wishlist-count').forEach(function (el) {
        el.textContent = count;
        if (count > 0) {
          el.classList.remove('d-none');
        } else {
          el.classList.add('d-none');
        }
      });
    });
  }

  function syncHeartIcons() {
    if (!window.Api || !window.Auth) return;
    var user = window.Auth.getCurrentUser();
    var buttons = document.querySelectorAll('[data-wishlist-vin]');
    if (!user) {
      buttons.forEach(function (btn) {
        btn.classList.remove('active');
        var icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-heart';
        }
      });
      return;
    }

    window.Api.getWishlist(user.Id).then(function (items) {
      var savedVins = items.map(function (i) { return i.CarVin.toUpperCase(); });
      buttons.forEach(function (btn) {
        var vin = (btn.getAttribute('data-wishlist-vin') || '').toUpperCase();
        var icon = btn.querySelector('i');
        if (savedVins.indexOf(vin) !== -1) {
          btn.classList.add('active');
          if (icon) icon.className = 'bi bi-heart-fill text-gold';
        } else {
          btn.classList.remove('active');
          if (icon) icon.className = 'bi bi-heart';
        }
      });
    });
  }

  function toggleWishlist(vin, buttonEl) {
    if (!window.Api || !window.Auth) return Promise.reject(new Error("API not ready"));

    var user = window.Auth.getCurrentUser();
    if (!user) {
      window.UI.showToast("Please sign in to bookmark vehicles into your private collection.", "info");
      setTimeout(function () {
        var currentUrl = encodeURIComponent(window.location.href);
        var target = (window.location.pathname.indexOf('/catalog/') !== -1 ||
                      window.location.pathname.indexOf('/cart/') !== -1 ||
                      window.location.pathname.indexOf('/checkout/') !== -1 ||
                      window.location.pathname.indexOf('/wishlist/') !== -1 ||
                      window.location.pathname.indexOf('/reviews/') !== -1 ||
                      window.location.pathname.indexOf('/admin/') !== -1 ||
                      window.location.pathname.indexOf('/account/') !== -1)
          ? '../account/login.html?returnUrl=' + currentUrl
          : 'account/login.html?returnUrl=' + currentUrl;
        window.location.href = target;
      }, 1200);
      return Promise.resolve({ inWishlist: false, redirected: true });
    }

    return window.Api.toggleWishlist(vin, user.Id).then(function (res) {
      if (res.inWishlist) {
        window.UI.showToast("Vehicle bookmarked to your Private Wishlist.", "success");
      } else {
        window.UI.showToast("Vehicle removed from your Private Wishlist.", "info");
      }
      updateBadges();
      syncHeartIcons();
      window.dispatchEvent(new CustomEvent('rf:wishlist-updated', { detail: res }));
      return res;
    }).catch(function (err) {
      window.UI.showToast(err.message, "error");
      throw err;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
    syncHeartIcons();

    // Delegate clicks for wishlist buttons
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-wishlist-vin]');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        var vin = btn.getAttribute('data-wishlist-vin');
        toggleWishlist(vin, btn);
      }
    });
  });

  window.addEventListener('rf:auth-change', function () {
    updateBadges();
    syncHeartIcons();
  });

  window.addEventListener('rf:wishlist-updated', function () {
    updateBadges();
    syncHeartIcons();
  });

  window.Wishlist = {
    updateBadges: updateBadges,
    syncHeartIcons: syncHeartIcons,
    toggleWishlist: toggleWishlist
  };

})();

