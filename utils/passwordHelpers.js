const crypto = require('crypto');
const KEY_LENGTH = 64;
function derive(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(String(password), salt, KEY_LENGTH, (error, key) => error ? reject(error) : resolve(key));
  });
}
async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}
async function verifyPassword(password, stored) {
  const [algo, saltHex, keyHex] = String(stored || '').split('$');
  if (algo !== 'scrypt' || !saltHex || !keyHex) return false;
  try {
    const expected = Buffer.from(keyHex, 'hex');
    const actual = await derive(password, Buffer.from(saltHex, 'hex'));
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch { return false; }
}
module.exports = { hashPassword, verifyPassword };
