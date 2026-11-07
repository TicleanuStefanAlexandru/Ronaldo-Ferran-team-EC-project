/**
 * RF Prestige — Shopping Cart State & UI Sync
 */

(function () {
  'use strict';

  function updateBadges() {
    if (!window.Api) return;
    window.Api.getCart().then(function (cart) {
      var badges = document.querySelectorAll('.cart-count');
      badges.forEach(function (el) {
        el.textContent = cart.itemCount;
        if (cart.itemCount > 0) {
          el.classList.remove('d-none');
        } else {
          el.classList.add('d-none');
        }
      });
    });
  }

  function addToCart(vin, buttonEl) {
    if (!window.Api) return Promise.reject(new Error("API not loaded"));

    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Reserving...';
    }

    return window.Api.addToCart(vin)
      .then(function (res) {
        if (res.added) {
          window.UI.showToast(res.message, 'success');
        } else {
          window.UI.showToast(res.message, 'info');
        }
        updateBadges();
        window.dispatchEvent(new CustomEvent('rf:cart-updated'));
        return res;
      })
      .catch(function (err) {
        window.UI.showToast(err.message, 'error');
        throw err;
      })
      .finally(function () {
        if (buttonEl) {
          buttonEl.disabled = false;
          buttonEl.innerHTML = '<i class="bi bi-bag-plus me-2"></i> Add to Cart';
        }
      });
  }

  function removeFromCart(vin) {
    if (!window.Api) return Promise.reject(new Error("API not loaded"));
    return window.Api.removeFromCart(vin).then(function () {
      window.UI.showToast("Vehicle removed from your acquisition cart.", "info");
      updateBadges();
      window.dispatchEvent(new CustomEvent('rf:cart-updated'));
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
  });

  window.addEventListener('rf:cart-updated', updateBadges);

  window.Cart = {
    updateBadges: updateBadges,
    addToCart: addToCart,
    removeFromCart: removeFromCart
  };

})();

