const AdminUser = require('../models/AdminUser');
const { hashPassword, verifyPassword } = require('../utils/passwordHelpers');

async function adminRoot(req, res, next) {
  try {
    const exists = Boolean(await AdminUser.exists({ singletonKey: 'primary' }));
    if (!exists) return res.redirect('/admin/setup');
    return res.redirect(req.session?.adminId ? '/admin/dashboard' : '/admin/login');
  } catch (e) { next(e); }
}
async function setupPage(req, res, next) {
  try {
    if (await AdminUser.exists({ singletonKey: 'primary' })) return res.redirect('/admin/login');
    res.render('admin/setup', { error: '' });
  } catch (e) { next(e); }
}
async function setup(req, res, next) {
  try {
    if (await AdminUser.exists({ singletonKey: 'primary' })) return res.redirect('/admin/login');
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const confirm = String(req.body.confirmPassword || '');
    if (username.length < 3) return res.status(400).render('admin/setup', { error: 'Username must be at least 3 characters.' });
    if (password.length < 8) return res.status(400).render('admin/setup', { error: 'Password must be at least 8 characters.' });
    if (password !== confirm) return res.status(400).render('admin/setup', { error: 'Passwords do not match.' });
    const admin = await AdminUser.create({ singletonKey: 'primary', username, usernameNormalized: username.toLowerCase(), passwordHash: await hashPassword(password) });
    req.session.adminId = String(admin._id);
    req.session.adminSessionVersion = Number(admin.sessionVersion || 1);
    res.redirect('/admin/dashboard');
  } catch (e) { if (e?.code === 11000) return res.redirect('/admin/login'); next(e); }
}
async function loginPage(req, res, next) {
  try {
    if (!(await AdminUser.exists({ singletonKey: 'primary' }))) return res.redirect('/admin/setup');
    if (req.session?.adminId) return res.redirect('/admin/dashboard');
    res.render('admin/login', { error: '' });
  } catch (e) { next(e); }
}
async function login(req, res, next) {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const admin = await AdminUser.findOne({ singletonKey: 'primary', usernameNormalized: username });
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) return res.status(401).render('admin/login', { error: 'Invalid username or password.' });
    admin.lastLoginAt = new Date(); await admin.save();
    req.session.adminId = String(admin._id);
    req.session.adminSessionVersion = Number(admin.sessionVersion || 1);
    res.redirect('/admin/dashboard');
  } catch (e) { next(e); }
}
function logout(req, res, next) { req.session.destroy(err => err ? next(err) : res.redirect('/admin/login')); }
module.exports = { adminRoot, setupPage, setup, loginPage, login, logout };
