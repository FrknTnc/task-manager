/**
 * @file userController.js
 * @description Kullanıcı listeleme işlemini yöneten controller fonksiyonunu içerir.
 * İş mantığı servis katmanındaki `userService.js` dosyasında yer almaktadır.
 * @module controllers/userController
 */

const { getAllUsers } = require("../services/userService");

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = { getAllUsers: getAllUsersHandler };
