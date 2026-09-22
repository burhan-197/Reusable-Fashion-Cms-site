function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function cleanText(value, max = 1000) {
  return String(value || '').replace(/\0/g, '').trim().slice(0, max);
}
function metaDescription(value, fallback = '') {
  const text = cleanText(value || fallback, 300).replace(/\s+/g, ' ');
  return text.length <= 155 ? text : `${text.slice(0, 152).trim()}...`;
}
module.exports = { slugify, escapeRegex, cleanText, metaDescription };
