const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../backend/server'); // Assuming your Express app is exported from 'server.js'

jest.mock('bcrypt', () => ({
  hash: jest.fn((data, saltRounds) => Promise.resolve("hashedpassword")),
  compare: jest.fn((data, hash) => Promise.resolve(data === "testpassword" && hash === "hashedpassword")),
}));

describe('API Endpoints', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  test('POST /api/signup - Successful Signup', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    const users = db.collection('users');
    const insertedUser = await users.findOne({ username: 'testuser' });

    expect(response.status).toBe(201); // Adjust based on your actual response
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(insertedUser).toHaveProperty('username', 'testuser');
    expect(insertedUser).toHaveProperty('password', 'hashedpassword');
  });
});
