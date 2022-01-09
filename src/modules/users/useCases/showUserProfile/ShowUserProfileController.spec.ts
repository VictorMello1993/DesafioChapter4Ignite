import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database/index'

let connection: Connection;

describe('Show user profile controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("It should be able to list user's profile", async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User test',
      email: 'test@test.com',
      password: '1234'
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '1234'
    });

    const {token} = responseToken.body;

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).not.toBe({});
    expect(response.status).toBe(200);
  })

  it("It should not be able to list user's profile if does not exist", async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer invalid_token`
    });

    expect(response.body).not.toBe({});
    expect(response.status).toBe(401);
  })
})
