(() => {
  'use strict';
  function syncCartCount() {
    const node = document.getElementById('navCartCount');
    if (!node || !window.cartManager) return;
    const count = window.cartManager.getItemCount();
    node.textContent = String(count);
    const bag = node.closest('a[aria-label]');
    if (bag) bag.setAttribute('aria-label', `Shopping bag, ${count} item${count === 1 ? '' : 's'}`);
  }
  document.addEventListener('DOMContentLoaded', () => { syncCartCount(); initMobileMenu(); });
  window.addEventListener('storefront:cartchange', syncCartCount);
  window.addEventListener('storage', event => { if (event.key === 'storefront_cart_v1') syncCartCount(); });

  function initMobileMenu() {
    const menu = document.querySelector('.f-mobile-menu');
    if (!menu) return;
    const closeButton = menu.querySelector('.f-mobile-menu-close');
    const syncState = () => document.body.classList.toggle('f-menu-open', menu.open);
    menu.addEventListener('toggle', syncState);
    closeButton?.addEventListener('click', () => { menu.open = false; });
    menu.querySelectorAll('.f-mobile-panel a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.open) menu.open = false; });
    syncState();
  }
  syncCartCount();
})();
