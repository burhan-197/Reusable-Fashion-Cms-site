const cartItemsContainer = document.querySelector('.cart-items');
const cartItemCount = document.querySelector('.cart-item-count');
const subtotalAmount = document.querySelector('.subtotal-amount');
const shippingAmount = document.querySelector('.shipping-amount');
const totalAmount = document.querySelector('.total-amount');
const cartSummary = document.querySelector('.cart-summary');

function currency(amount) {
  return window.StoreCurrency
    ? window.StoreCurrency.formatMoney(amount)
    : `$ ${Number(amount || 0).toLocaleString()}`;
}

function safeAssetUrl(value) {
  const raw = String(value || '').trim();
  if (!raw || /^(?:javascript|data|vbscript):/i.test(raw)) return '';
  if (raw.startsWith('/')) return raw;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === 'https:' && parsed.hostname === 'res.cloudinary.com') return parsed.href;
  } catch {}
  return '';
}

function productHref(item) {
  return item.slug ? `/products/${encodeURIComponent(item.slug)}` : '/products';
}

function parseVariant(value) {
  const raw = String(value || '').trim();
  if (!raw) return [];
  const parts = raw.split('/').map(part => part.trim()).filter(Boolean);
  if (parts.length === 2) return [
    { label: 'Color', value: parts[0] },
    { label: 'Size', value: parts[1] }
  ];
  return [{ label: 'Option', value: raw }];
}

function createMedia(item) {
  const link = document.createElement('a');
  link.className = 'f-cart-media';
  link.href = productHref(item);
  const imageUrl = safeAssetUrl(item.image);
  if (imageUrl) {
    const image = document.createElement('img');
    image.alt = String(item.name || 'Product');
    if (window.StoreImages) {
      window.StoreImages.apply(image, imageUrl, { width: 320, widths: [160, 320, 640], sizes: '120px' });
    } else {
      image.src = imageUrl;
    }
    link.append(image);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'f-cart-media-placeholder';
    placeholder.textContent = String(item.emoji || 'FORME');
    link.append(placeholder);
  }
  return link;
}

function updateSummary(items) {
  const totals = window.cartManager.getTotals(items);
  if (subtotalAmount) subtotalAmount.textContent = currency(totals.subtotal);
  if (shippingAmount) shippingAmount.textContent = totals.shipping === 0 ? 'Free' : currency(totals.shipping);
  if (totalAmount) totalAmount.textContent = currency(totals.total);
}

function emptyState() {
  const emptyHeading = cartItemsContainer?.dataset.emptyHeading || 'Your bag is empty';
  const emptyDescription = cartItemsContainer?.dataset.emptyDescription || 'Explore the collection and add the pieces that feel right.';
  const emptyButtonLabel = cartItemsContainer?.dataset.emptyButtonLabel || 'Shop the collection';
  const wrapper = document.createElement('div');
  wrapper.className = 'f-cart-empty';
  wrapper.innerHTML = `
    <div class="f-cart-empty-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5.5 8.5h13l-1 11h-11z"></path><path d="M9 9V6.8A3 3 0 0 1 12 4a3 3 0 0 1 3 2.8V9"></path></svg>
    </div>
    <h2>${emptyHeading}</h2>
    <p>${emptyDescription}</p>
    <a class="f-button" href="/products">${emptyButtonLabel} <span class="f-link-arrow" aria-hidden="true"></span></a>`;
  return wrapper;
}

function renderCart() {
  if (!window.cartManager || !cartItemsContainer) return;
  const items = window.cartManager.getCart();
  const count = window.cartManager.getItemCount(items);
  if (cartItemCount) cartItemCount.textContent = `${count} item${count === 1 ? '' : 's'}`;

  if (!items.length) {
    cartItemsContainer.replaceChildren(emptyState());
    if (cartSummary) cartSummary.hidden = true;
    if (window.refreshCartUI) window.refreshCartUI();
    return;
  }

  if (cartSummary) cartSummary.hidden = false;
  const rows = items.map(item => {
    const row = document.createElement('article');
    row.className = 'f-cart-item';
    row.dataset.id = String(item.id);
    row.dataset.weight = String(item.weight || '');

    const media = createMedia(item);
    const info = document.createElement('div');
    info.className = 'f-cart-info';

    const kicker = document.createElement('p');
    kicker.className = 'f-cart-kicker';
    kicker.textContent = String(item.categoryName || item.category || 'Product');

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = productHref(item);
    titleLink.textContent = String(item.name || 'Product');
    title.append(titleLink);

    const variants = document.createElement('dl');
    variants.className = 'f-cart-options';
    parseVariant(item.weight).forEach(option => {
      const div = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = option.label;
      dd.textContent = option.value;
      div.append(dt, dd);
      variants.append(div);
    });

    const actions = document.createElement('div');
    actions.className = 'f-cart-actions';
    const qty = document.createElement('div');
    qty.className = 'f-qty-control';
    qty.setAttribute('aria-label', 'Quantity');
    qty.innerHTML = `<button type="button" data-action="decrease" aria-label="Decrease quantity">−</button><input type="text" value="${Number(item.qty || 1)}" aria-label="Quantity" readonly><button type="button" data-action="increase" aria-label="Increase quantity">+</button>`;
    const remove = document.createElement('button');
    remove.className = 'f-cart-link';
    remove.type = 'button';
    remove.dataset.action = 'remove';
    remove.textContent = 'Remove';
    actions.append(qty, remove);
    info.append(kicker, title);
    if (variants.children.length) info.append(variants);
    info.append(actions);

    const price = document.createElement('p');
    price.className = 'f-cart-price';
    price.textContent = currency(Number(item.price || 0) * Number(item.qty || 1));

    row.append(media, info, price);
    return row;
  });

  cartItemsContainer.replaceChildren(...rows);
  updateSummary(items);
  if (window.refreshCartUI) window.refreshCartUI();
}

cartItemsContainer?.addEventListener('click', event => {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement || !window.cartManager) return;
  const row = actionElement.closest('.f-cart-item');
  if (!row) return;

  const id = row.dataset.id;
  const weight = row.dataset.weight;
  const action = actionElement.dataset.action;
  const target = window.cartManager.getCart().find(item => item.id === id && item.weight === weight);
  if (!target) return;

  if (action === 'remove') window.cartManager.removeItem(id, weight);
  if (action === 'increase') window.cartManager.updateQty(id, weight, Number(target.qty || 1) + 1);
  if (action === 'decrease') window.cartManager.updateQty(id, weight, Math.max(1, Number(target.qty || 1) - 1));
  renderCart();
});

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  try {
    const noticeText = sessionStorage.getItem('storefront_reorder_notice');
    if (noticeText && cartItemsContainer) {
      const notice = document.createElement('div');
      notice.className = 'f-form-status';
      notice.textContent = noticeText;
      cartItemsContainer.before(notice);
      sessionStorage.removeItem('storefront_reorder_notice');
    }
  } catch {}
});
