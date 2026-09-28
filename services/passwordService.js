const bcrypt = require("bcryptjs");

/**
 * Hashes a plain-text password before it is stored in MongoDB.
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compares a plain-text password against the stored hash during login.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
