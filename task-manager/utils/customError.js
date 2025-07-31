/**
 * @file customError.js
 * @description Status kodu ve hata mesajı ile özelleştirilmiş hata sınıfı tanımı.
 * API'deki hata kontrolünü merkezi ve tutarlı hale getirir.
 * @module utils/customError
 */

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
