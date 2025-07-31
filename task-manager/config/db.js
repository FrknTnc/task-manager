/**
 * @file db.js
 * @description MongoDB veritabanı bağlantısını yöneten konfigürasyon dosyasıdır.
 * Ortam değişkenine göre URI belirlenir ve bağlantı gerçekleştirilir.
 * @module config/db
 */

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const uri =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;

    await mongoose.connect(uri);
    console.log('MongoDB bağlantısı başarılı');
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
