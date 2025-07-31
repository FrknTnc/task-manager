/**
 * @file authorizeRoles.js
 * @description Belirtilen roller dışında kalan kullanıcıların erişimini engelleyen middleware.
 * Örneğin: `authorizeRoles('Admin', 'Manager')` gibi kullanılır.
 * @module middlewares/authorizeRoles
 */

const CustomError = require('../utils/customError');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new CustomError(403, 'Access forbidden: insufficient role');
    }
    next();
  };
};

module.exports = authorizeRoles;
