(() => {
  'use strict';
  const data = document.getElementById('formeLiteProductData');
  if (!data) return;
  const product = {
    id: data.dataset.id || '',
    name: data.dataset.name || '',
    price: Number(data.dataset.price || 0),
    stock: Number(data.dataset.stock || 0),
    image: data.dataset.image || '',
    slug: data.dataset.slug || '',
    categoryName: data.dataset.category || ''
  };
  const quantity = document.getElementById('quantity');
  const status = document.getElementById('formeAddStatus');

  function add(redirect) {
    if (!window.cartManager || product.stock < 1) return;
    const qty = Math.max(1, Math.min(product.stock, Number(quantity?.value || 1)));
    window.cartManager.addItem({
      id: product.id,
      name: product.name,
      categoryName: product.categoryName,
      slug: product.slug,
      price: product.price,
      image: product.image,
      weight: ''
    }, qty);
    if (status) status.textContent = 'Added to your bag.';
    if (redirect) window.location.href = redirect;
  }
  document.getElementById('formeAddToBag')?.addEventListener('click', () => add(''));
  document.getElementById('formeBuyNow')?.addEventListener('click', () => add('/checkout'));

  const thumbs = Array.from(document.querySelectorAll('.f-gallery-thumb'));
  const main = document.getElementById('formeMainImage');
  let index = 0;
  function show(i) {
    if (!main || !thumbs.length) return;
    index = (Number(i) + thumbs.length) % thumbs.length;
    const thumb = thumbs[index];
    main.src = thumb.dataset.gallerySrc || main.src;
    main.alt = thumb.dataset.galleryAlt || product.name;
    thumbs.forEach((node, n) => {
      node.classList.toggle('is-active', n === index);
      node.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
  }
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));
  document.getElementById('formeGalleryPrev')?.addEventListener('click', () => show(index - 1));
  document.getElementById('formeGalleryNext')?.addEventListener('click', () => show(index + 1));
})();
