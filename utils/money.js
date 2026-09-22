const store = require('../config/store');
function formatMoney(amount) {
  const n = Number(amount || 0);
  return `${store.currencySymbol}${Number.isFinite(n) ? n.toFixed(2) : '0.00'}`;
}
module.exports = { formatMoney };
