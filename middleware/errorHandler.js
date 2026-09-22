function notFound(req, res) {
  res.status(404).render('public/pages/not-found', { pageTitle: 'Page not found', metaDescription: 'The requested page could not be found.' });
}
function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  if (req.path.startsWith('/api/')) return res.status(error.statusCode || 500).json({ success: false, message: error.expose ? error.message : 'Something went wrong.' });
  res.status(error.statusCode || 500).render('public/pages/server-error', { pageTitle: 'Server error', metaDescription: 'An unexpected error occurred.' });
}
module.exports = { notFound, errorHandler };
