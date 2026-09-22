(function initStoreCurrency(global) {
  'use strict';

  function readConfig() {
    var source = document.body && document.body.dataset
      ? document.body.dataset
      : {};

    var adminConfig = document.getElementById('adminCurrencyConfig');
    if (adminConfig && adminConfig.dataset) {
      source = adminConfig.dataset;
    }

    var symbol = typeof source.currencySymbol === 'string' && source.currencySymbol.trim()
      ? source.currencySymbol.trim()
      : '$';
    var code = typeof source.currencyCode === 'string' && source.currencyCode.trim()
      ? source.currencyCode.trim().toUpperCase()
      : 'USD';
    var position = source.currencyPosition === 'after' ? 'after' : 'before';

    return { symbol: symbol, code: code, position: position };
  }

  function formatMoney(amount) {
    var currency = readConfig();
    var number = Number(amount);
    if (!Number.isFinite(number)) number = 0;

    var formatted = number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return currency.position === 'after'
      ? formatted + ' ' + currency.code
      : currency.symbol + ' ' + formatted;
  }

  global.StoreCurrency = {
    getConfig: readConfig,
    formatMoney: formatMoney
  };
})(window);
