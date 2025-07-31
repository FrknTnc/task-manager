require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const { app } = require('../app');
const Project = require('../models/Project');
const User = require('../models/User');
const { loginAndGetToken } = require('./testHelpers');

describe('Project API Test Suite', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    token = await loginAndGetToken(); 
  });

  afterEach(async () => {
    await Project.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('Should create a new project', async () => {
    const res = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Project');
    expect(res.body.description).toBe('This is a test project');
    expect(res.body.createdBy).toBeDefined();
  });

  test('Should get list of user\'s projects', async () => {
    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Another Project' });

    const res = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('Should fail to create project without token', async () => {
    const res = await request(app)
        .post('/projects')
        .send({ name: 'Fail Project' });

    expect(res.statusCode).toBe(401);
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message.toLowerCase()).toMatch(/token|unauthorized|access/);
    });

    test('Should fail to create project without name', async () => {
        const res = await request(app)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Missing name field' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message.toLowerCase()).toMatch(/name|required/i);
    });

    test('Should not see another user\'s projects', async () => {
        const otherToken = await loginAndGetToken({ email: 'other@example.com' });

        await request(app)
            .post('/projects')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ name: 'Other User Project' });

        const res = await request(app)
            .get('/projects')
            .set('Authorization', `Bearer ${token}`);

        const names = res.body.map(p => p.name);
        expect(names).not.toContain('Other User Project');
    });

    test('Should return empty array if no projects exist', async () => {
        const freshToken = await loginAndGetToken({ email: 'newuser@example.com' });

        const res = await request(app)
            .get('/projects')
            .set('Authorization', `Bearer ${freshToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });


});
