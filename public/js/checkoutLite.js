(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkoutForm');
    if (!form || !window.cartManager) return;
    const itemsNode = document.getElementById('checkoutSummaryItems');
    const subtotalNode = document.getElementById('checkoutSubtotal');
    const totalNode = document.getElementById('checkoutTotal');
    const errorNode = document.getElementById('checkoutError');
    const button = document.getElementById('placeOrderButton');
    const money = value => window.StoreCurrency ? window.StoreCurrency.formatMoney(value) : `$${Number(value || 0).toFixed(2)}`;

    function showError(message) {
      if (!errorNode) return;
      errorNode.textContent = message || '';
      errorNode.hidden = !message;
    }

    function render() {
      const items = window.cartManager.getCart();
      itemsNode.replaceChildren();
      let subtotal = 0;
      items.forEach(item => {
        const line = document.createElement('div');
        line.className = 'f-account-detail-line';
        const left = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = String(item.name || 'Product');
        const small = document.createElement('span');
        small.textContent = `Qty ${Number(item.qty || 1)}`;
        left.append(strong, small);
        const price = document.createElement('strong');
        const lineTotal = Number(item.price || 0) * Number(item.qty || 0);
        subtotal += lineTotal;
        price.textContent = money(lineTotal);
        line.append(left, price);
        itemsNode.append(line);
      });
      subtotalNode.textContent = money(subtotal);
      totalNode.textContent = money(subtotal);
      if (!items.length) {
        showError('Your bag is empty.');
        button.disabled = true;
      }
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();
      showError('');
      const items = window.cartManager.getCart();
      if (!items.length) return showError('Your bag is empty.');
      const fields = Object.fromEntries(new FormData(form).entries());
      fields.cartItems = items.map(item => ({ id: item.id, qty: item.qty }));
      button.disabled = true;
      const oldText = button.textContent;
      button.textContent = 'Placing order…';
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': document.getElementById('csrfToken').value },
          body: JSON.stringify(fields)
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Could not place order.');
        window.cartManager.clearCart();
        window.location.href = `/order-complete?id=${encodeURIComponent(data.orderId)}`;
      } catch (error) {
        showError(error.message || 'Could not place order.');
        button.disabled = false;
        button.textContent = oldText;
      }
    });

    render();
  });
})();
