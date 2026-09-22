const AdminUser = require('../models/AdminUser');
async function requireAdmin(req, res, next) {
  try {
    const id = req.session?.adminId;
    if (!id) return res.redirect('/admin/login');
    const admin = await AdminUser.findById(id).lean();
    if (!admin || Number(admin.sessionVersion || 1) !== Number(req.session.adminSessionVersion || 1)) {
      req.session.adminId = null;
      return res.redirect('/admin/login');
    }
    res.locals.admin = { id: String(admin._id), username: admin.username };
    next();
  } catch (error) { next(error); }
}
module.exports = { requireAdmin };
