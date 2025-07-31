const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');

/**
 * Testler için sahte kullanıcı oluşturup JWT token'ı döner.
 * @returns {Promise<string>} JWT token
 */
const loginAndGetToken = async () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
    role: 'Developer'
  };

  await User.deleteMany({ email: testUser.email });

  // Kayıt ol
  await request(app).post('/auth/register').send(testUser);

  // Giriş yap
  const loginRes = await request(app).post('/auth/login').send({
    email: testUser.email,
    password: testUser.password
  });

  return loginRes.body.token;
};

/**
 * Token kullanarak test için yeni bir proje oluşturur.
 * @param {string} token JWT Token
 * @param {string} name Proje ismi (opsiyonel)
 * @returns {Promise<object>} Oluşturulan proje objesi
 */
const createSampleProject = async (token, name = 'Test Project') => {
  const res = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name });

  return res.body;
};

module.exports = {
  loginAndGetToken,
  createSampleProject
};
