const Product = require('../models/Product');
const Category = require('../models/Category');
const homepage = require('../config/homepage');
const { escapeRegex, metaDescription } = require('../utils/text');

async function getCategories() {
  return Category.find().sort({ name: 1 }).lean();
}

function decorate(product) {
  if (!product) return product;
  return {
    ...product,
    categoryName: product.category?.name || '',
    categorySlug: product.category?.slug || '',
    desc: product.description || ''
  };
}

async function home(req, res, next) {
  try {
    const [rawProducts, categories] = await Promise.all([
      Product.find().populate('category').sort({ createdAt: -1 }).limit(8).lean(),
      getCategories()
    ]);
    const products = rawProducts.map(decorate);
    res.render('public/pages/home', {
      active: 'home',
      categories,
      formeHomepage: homepage,
      homeNewArrivals: products.slice(0, 4),
      homeBestSellers: (products.length > 4 ? products.slice(4, 8) : products.slice(0, 4)),
      pageTitle: 'FORME — Modern Fashion Store',
      metaDescription: 'Shop modern fashion essentials from FORME.'
    });
  } catch (e) { next(e); }
}

async function shop(req, res, next) {
  try {
    const q = String(req.query.q || '').trim().slice(0, 100);
    const categorySlug = String(req.query.category || '').trim();
    const sort = ['newest', 'price-asc', 'price-desc'].includes(String(req.query.sort || '')) ? String(req.query.sort) : 'newest';
    const filter = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ name: rx }, { description: rx }];
    }
    let selectedCategory = null;
    if (categorySlug) {
      selectedCategory = await Category.findOne({ slug: categorySlug }).lean();
      if (selectedCategory) filter.category = selectedCategory._id;
    }
    const mongoSort = sort === 'price-asc' ? { price: 1 } : sort === 'price-desc' ? { price: -1 } : { createdAt: -1 };
    const [rawProducts, categories] = await Promise.all([
      Product.find(filter).populate('category').sort(mongoSort).lean(),
      getCategories()
    ]);
    const products = rawProducts.map(decorate);
    const categorySummary = {};
    categories.forEach(c => { categorySummary[c.slug] = 0; });
    const allForCounts = await Product.find().populate('category').lean();
    allForCounts.forEach(p => {
      const slug = p.category?.slug;
      if (slug && Object.prototype.hasOwnProperty.call(categorySummary, slug)) categorySummary[slug] += 1;
    });
    res.render('public/pages/products', {
      active: 'products',
      products,
      categories,
      q,
      searchQuery: q,
      categorySlug,
      selectedCategory,
      currentCategory: selectedCategory?.slug || '',
      categorySummary,
      totalProducts: products.length,
      sort,
      pageTitle: selectedCategory ? `${selectedCategory.name} — FORME` : 'Shop — FORME',
      metaDescription: selectedCategory ? `Shop ${selectedCategory.name} at FORME.` : 'Browse the FORME fashion collection.'
    });
  } catch (e) { next(e); }
}

async function detail(req, res, next) {
  try {
    const [rawProduct, categories] = await Promise.all([
      Product.findOne({ slug: req.params.slug }).populate('category').lean(),
      getCategories()
    ]);
    if (!rawProduct) {
      return res.status(404).render('public/pages/not-found', {
        categories,
        pageTitle: 'Product not found',
        metaDescription: 'The requested product could not be found.'
      });
    }
    const product = decorate(rawProduct);
    res.render('public/pages/detail', {
      active: 'products',
      categories,
      product,
      pageTitle: `${product.name} — FORME`,
      metaDescription: metaDescription(product.description, product.name)
    });
  } catch (e) { next(e); }
}

async function cart(req, res, next) {
  try {
    const categories = await getCategories();
    res.render('public/pages/cart', { active: 'cart', categories, pageTitle: 'Shopping Bag — FORME', metaDescription: 'Review your shopping bag.' });
  } catch (e) { next(e); }
}

async function checkout(req, res, next) {
  try {
    const categories = await getCategories();
    res.render('public/pages/checkout', { active: 'cart', categories, pageTitle: 'Checkout — FORME', metaDescription: 'Complete your order with guest checkout.' });
  } catch (e) { next(e); }
}

module.exports = { home, shop, detail, cart, checkout };
