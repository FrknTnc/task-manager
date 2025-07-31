/**
 * @file userService.js
 * @description Kullanıcı listeleme işlemlerine ait iş mantığını içerir.
 * @module services/userService
 */

const User = require("../models/User");
const CustomError = require("../utils/customError");

const getAllUsers = async () => {
  const users = await User.find().select("name role _id");

  if (!users || users.length === 0) {
    throw new CustomError(404, "Kullanıcı bulunamadı");
  }

  return users;
};

module.exports = { getAllUsers };
