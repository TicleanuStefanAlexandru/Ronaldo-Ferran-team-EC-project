/**
 * RF Prestige — UI Utilities
 * Formatting, Notifications, VIN Copier, Invoice Viewer
 */

(function () {
  'use strict';

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatCurrency(amount) {
    var num = Number(amount) || 0;
    return '€' + num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function formatDate(isoString) {
    if (!isoString) return '—';
    try {
      var d = new Date(isoString);
      return d.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  }

  function formatNumber(num) {
    var n = Number(num) || 0;
    return n.toLocaleString('en-US');
  }

  function showToast(message, type) {
    type = type || 'info'; // success, error, info
    var container = document.getElementById('rf-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'rf-toast-container';
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '99999';
      document.body.appendChild(container);
    }

    var iconClass = 'bi-info-circle-fill text-info';
    var bgClass = 'bg-dark text-light border border-secondary';
    if (type === 'success') {
      iconClass = 'bi-check-circle-fill text-success';
      bgClass = 'bg-dark text-light border-gold';
    } else if (type === 'error') {
      iconClass = 'bi-exclamation-triangle-fill text-danger';
      bgClass = 'bg-dark text-light border-danger';
    }

    var toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center ' + bgClass;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    var flexDiv = document.createElement('div');
    flexDiv.className = 'd-flex';

    var bodyDiv = document.createElement('div');
    bodyDiv.className = 'toast-body d-flex align-items-center gap-2 py-3 px-3';

    var icon = document.createElement('i');
    icon.className = 'bi ' + iconClass + ' fs-5';

    var text = document.createElement('span');
    text.textContent = message;

    bodyDiv.appendChild(icon);
    bodyDiv.appendChild(text);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
    closeBtn.setAttribute('data-bs-dismiss', 'toast');
    closeBtn.setAttribute('aria-label', 'Close');

    flexDiv.appendChild(bodyDiv);
    flexDiv.appendChild(closeBtn);
    toastEl.appendChild(flexDiv);

    container.appendChild(toastEl);

    if (window.bootstrap && window.bootstrap.Toast) {
      var bsToast = new window.bootstrap.Toast(toastEl, { delay: 4000 });
      bsToast.show();
      toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
      });
    } else {
      setTimeout(function () {
        toastEl.remove();
      }, 4000);
    }
  }

  function copyVin(vin, triggerElement) {
    if (!vin) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(vin).then(function () {
        showToast('VIN ' + vin + ' copied to clipboard.', 'success');
        if (triggerElement) {
          var original = triggerElement.innerHTML;
          triggerElement.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          setTimeout(function () {
            triggerElement.innerHTML = original;
          }, 2000);
        }
      }).catch(function () {
        fallbackCopy(vin);
      });
    } else {
      fallbackCopy(vin);
    }

    function fallbackCopy(text) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('VIN copied to clipboard.', 'success');
      } catch (err) {
        showToast('Please select and copy VIN: ' + text, 'info');
      }
      document.body.removeChild(textArea);
    }
  }

  function openInvoiceModal(order) {
    if (!order) return;
    var modalId = 'rf-invoice-modal';
    var existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    var deliveryText = order.DeliveryOption === 1 ? 'Enclosed Trailer Delivery (+€490)' : 'VIP Showroom Pickup (€0)';
    var deliveryFee = order.DeliveryOption === 1 ? 490 : 0;
    var subtotal = order.TotalAmount - deliveryFee;

    var itemsHtml = '';
    (order.Items || []).forEach(function (item) {
      itemsHtml += '<tr>' +
        '<td class="py-3"><div class="fw-bold text-light">' + escapeHtml(item.VehicleTitle || 'Luxury Automobile') + '</div>' +
        '<div class="text-secondary small font-monospace">VIN: ' + escapeHtml(item.CarVin) + '</div></td>' +
        '<td class="py-3 text-center">1</td>' +
        '<td class="py-3 text-end fw-semibold">' + formatCurrency(item.UnitPrice) + '</td>' +
      '</tr>';
    });

    var modalHtml = '<div class="modal fade" id="' + modalId + '" tabindex="-1" aria-labelledby="invoiceTitle" aria-hidden="true">' +
      '<div class="modal-dialog modal-lg modal-dialog-centered">' +
        '<div class="modal-content bg-charcoal text-light border-gold shadow-lg">' +
          '<div class="modal-header border-secondary border-opacity-25 pb-3">' +
            '<div class="d-flex align-items-center gap-2">' +
              '<i class="bi bi-receipt-cutoff text-gold fs-4"></i>' +
              '<h5 class="modal-title font-serif tracking-wide" id="invoiceTitle">TAX INVOICE — ORDER #' + escapeHtml(order.Id) + '</h5>' +
            '</div>' +
            '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
          '</div>' +
          '<div class="modal-body p-4 p-md-5" id="printableInvoiceArea">' +
            '<div class="d-flex justify-content-between align-items-start border-bottom border-secondary border-opacity-25 pb-4 mb-4">' +
              '<div>' +
                '<div class="h4 font-serif text-gold mb-1">RF PRESTIGE MOTORS S.R.L.</div>' +
                '<div class="small text-secondary">Calea Floreasca 169A, Sector 1, Bucharest, Romania</div>' +
                '<div class="small text-secondary">Fiscal Code: RO42981045 • Reg. Com: J40/1209/2021</div>' +
                '<div class="small text-secondary">IBAN: RO49INGB0000999912345678 (ING Bank Bucharest)</div>' +
              '</div>' +
              '<div class="text-end">' +
                '<span class="badge bg-gold-subtle text-gold border border-gold px-3 py-2 text-uppercase font-sans">' + escapeHtml(order.Status) + '</span>' +
                '<div class="small text-secondary mt-2">Date: ' + formatDate(order.CreatedAt) + '</div>' +
                '<div class="small font-monospace text-secondary">Tx: ' + escapeHtml(order.StripePaymentIntentId || 'STRIPE_TEST') + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="row mb-4">' +
              '<div class="col-md-6 mb-3 mb-md-0">' +
                '<div class="text-gold small text-uppercase tracking-wider fw-semibold mb-1">Billed & Delivered To:</div>' +
                '<div class="fw-bold">' + escapeHtml(order.CustomerName || 'Valued Client') + '</div>' +
                '<div class="text-secondary small">' + escapeHtml(order.CustomerEmail || 'customer@rfprestige.ro') + '</div>' +
                '<div class="text-secondary small mt-1">' + escapeHtml(order.ShippingAddressText || 'Bucharest, Romania') + '</div>' +
              '</div>' +
              '<div class="col-md-6 text-md-end">' +
                '<div class="text-gold small text-uppercase tracking-wider fw-semibold mb-1">Acquisition Details:</div>' +
                '<div class="small text-secondary">Payment Method: <span class="text-light">Stripe Test Card (•••• 4242)</span></div>' +
                '<div class="small text-secondary">Fulfillment: <span class="text-light">' + deliveryText + '</span></div>' +
              '</div>' +
            '</div>' +
            '<div class="table-responsive mb-4">' +
              '<table class="table table-dark table-borderless align-middle mb-0">' +
                '<thead class="border-bottom border-secondary border-opacity-50 text-secondary small text-uppercase">' +
                  '<tr>' +
                    '<th>Vehicle Specification & VIN</th>' +
                    '<th class="text-center">Qty</th>' +
                    '<th class="text-end">Unit Price</th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody>' + itemsHtml + '</tbody>' +
              '</table>' +
            '</div>' +
            '<div class="border-top border-secondary border-opacity-25 pt-3">' +
              '<div class="d-flex justify-content-between py-1 text-secondary small">' +
                '<span>Vehicle Acquisition Subtotal:</span>' +
                '<span class="font-monospace text-light">' + formatCurrency(subtotal) + '</span>' +
              '</div>' +
              '<div class="d-flex justify-content-between py-1 text-secondary small">' +
                '<span>Delivery & Logistics:</span>' +
                '<span class="font-monospace text-light">' + formatCurrency(deliveryFee) + '</span>' +
              '</div>' +
              '<div class="d-flex justify-content-between py-1 text-secondary small">' +
                '<span>VAT (19% Included in Luxury Price):</span>' +
                '<span class="font-monospace text-light">' + formatCurrency(order.TotalAmount * 0.19 / 1.19) + '</span>' +
              '</div>' +
              '<div class="d-flex justify-content-between py-2 border-top border-secondary border-opacity-50 mt-2">' +
                '<span class="h5 font-serif text-gold mb-0">TOTAL PAID:</span>' +
                '<span class="h4 font-serif text-gold font-monospace mb-0">' + formatCurrency(order.TotalAmount) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="mt-4 p-3 bg-dark-alt rounded small text-secondary border border-secondary border-opacity-25">' +
              '<i class="bi bi-shield-check text-gold me-2"></i>' +
              'Every vehicle sold through RF Prestige undergoes a 180-point technical inspection and is delivered with authentic manufacturer documentation, clean European title, and 12-month mechanical warranty.' +
            '</div>' +
          '</div>' +
          '<div class="modal-footer border-secondary border-opacity-25">' +
            '<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal">Close</button>' +
            '<button type="button" class="btn btn-gold btn-sm" onclick="window.print()"><i class="bi bi-printer me-1"></i> Print / Save as PDF</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    var modalEl = document.getElementById(modalId);
    var bsModal = new window.bootstrap.Modal(modalEl);
    bsModal.show();
  }

  window.UI = {
    escapeHtml: escapeHtml,
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    formatNumber: formatNumber,
    showToast: showToast,
    copyVin: copyVin,
    openInvoiceModal: openInvoiceModal
  };

})();

