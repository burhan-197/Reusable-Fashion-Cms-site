(function initCartManager(global) {
  const STORAGE_KEY = 'storefront_cart_v1';

  function parseStoredCart() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);

      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function sanitizeItem(item) {
    return {
      id: String(item.id || ''),
      name: String(item.name || ''),
      category: String(item.category || ''),
      categoryName: String(item.categoryName || ''),
      emoji: String(item.emoji || ''),
      slug: String(item.slug || ''),
      price: Number(item.price || 0),
      qty: Math.max(1, Number(item.qty || 1)),
      weight: String(item.weight || ''),
      image: String(item.image || ''),
    };
  }

  function getCart() {
    return parseStoredCart().map(sanitizeItem).filter(item => item.id);
  }

  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(sanitizeItem)));
    const saved = getCart();
    try { global.dispatchEvent(new CustomEvent('storefront:cartchange', { detail: { items: saved } })); } catch (_) {}
    return saved;
  }

  function findMatchingItemIndex(cart, incoming) {
    return cart.findIndex(item => item.id === incoming.id && item.weight === incoming.weight);
  }

  function addItem(product, qty = 1) {
    const incoming = sanitizeItem({ ...product, qty });
    if (!incoming.id) return getCart();

    const cart = getCart();
    const matchIndex = findMatchingItemIndex(cart, incoming);

    if (matchIndex >= 0) {
      cart[matchIndex].qty += incoming.qty;
    } else {
      cart.push(incoming);
    }

    return saveCart(cart);
  }

  function removeItem(id, weight) {
    const cart = getCart().filter(item => {
      if (item.id !== id) return true;
      if (typeof weight === 'string') return item.weight !== weight;
      return false;
    });
    return saveCart(cart);
  }

  function updateQty(id, weight, newQty) {
    const qty = Math.max(1, Number(newQty || 1));
    const cart = getCart();
    const index = cart.findIndex(item => item.id === id && item.weight === weight);
    if (index >= 0) {
      cart[index].qty = qty;
      return saveCart(cart);
    }
    return cart;
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    try { global.dispatchEvent(new CustomEvent('storefront:cartchange', { detail: { items: [] } })); } catch (_) {}
    return [];
  }

  function getItemCount(items = getCart()) {
    return items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }

  function readShippingConfig() {
    const data = document.body ? document.body.dataset : {};
    const flatRate = Number(data.shippingFlatRate);
    const freeThreshold = Number(data.shippingFreeThreshold);

    return {
      enabled: data.shippingEnabled === 'true',
      flatRate: {
        enabled: data.shippingFlatEnabled === 'true',
        amount: Number.isFinite(flatRate) && flatRate >= 0 ? flatRate : 0,
      },
      freeShipping: {
        enabled: data.shippingFreeEnabled === 'true',
        threshold: Number.isFinite(freeThreshold) && freeThreshold >= 0 ? freeThreshold : 0,
      },
    };
  }

  function getShipping(subtotal) {
    if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
    const shipping = readShippingConfig();
    if (!shipping.enabled) return 0;
    if (shipping.freeShipping.enabled && subtotal >= shipping.freeShipping.threshold) return 0;
    return shipping.flatRate.enabled ? shipping.flatRate.amount : 0;
  }

  function getTotals(items = getCart()) {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
    const shipping = getShipping(subtotal);
    return { subtotal, shipping, total: subtotal + shipping };
  }

  global.cartManager = {
    getCart,
    saveCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getItemCount,
    getTotals,
  };
})(window);
