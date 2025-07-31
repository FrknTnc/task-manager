
/**
 * @file task.test.js
 * @description Task endpoint'lerinin entegrasyon testlerini içerir.
 * Test edilen işlemler: görev oluşturma, listeleme, güncelleme, silme, log görüntüleme.
 */

require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const { app } = require('../app');
const Project = require('../models/Project');
const Task = require('../models/Task');
const TaskLog = require('../models/TaskLog');
const { loginAndGetToken, createSampleProject } = require('./testHelpers');

describe('Task API Test Suite', () => {
  let token, project;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    token = await loginAndGetToken();
    project = await createSampleProject(token);
  });

  afterEach(async () => {
    await Task.deleteMany();
    await TaskLog.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('Should create a task in project', async () => {
    const res = await request(app)
      .post(`/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sample Task', description: 'Testing...', priority: 'medium', status: 'pending' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Sample Task');
  });

  test('Should update a task and log change', async () => {
    const created = await request(app)
        .post(`/projects/${project._id}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updatable Task', description: 'desc', priority: 'low', status: 'pending' });

    const res = await request(app)
        .put(`/tasks/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated', description: 'desc', priority: 'high', status: 'pending' }); // <-- BURAYA DİKKAT

    expect(res.statusCode).toBe(200);
    expect(res.body.priority).toBe('high');

    const logRes = await request(app)
        .get(`/tasks/${created.body._id}/logs`)
        .set('Authorization', `Bearer ${token}`);

    expect(logRes.statusCode).toBe(200);
    expect(Array.isArray(logRes.body)).toBe(true);
    expect(logRes.body.length).toBe(1);
    });


  test('Should delete a task', async () => {
    const created = await request(app)
      .post(`/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Deletable Task', description: 'desc', priority: 'low', status: 'pending' });

    const res = await request(app)
      .delete(`/tasks/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
