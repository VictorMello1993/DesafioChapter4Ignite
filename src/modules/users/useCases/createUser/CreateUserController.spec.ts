import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database/index'

let connection: Connection

describe('Create user controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('It should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'User test',
      email: 'test@test.com',
      password: '1234'
    });

    expect(response.body).toEqual({});
    expect(response.status).toBe(201);
  })

  it('It should not be able to create a user if email exists', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'User test',
      email: 'test@test.com',
      password: '1234'
    });

    expect(response.body).not.toEqual({});
    expect(response.status).toBe(400);
  })
})
