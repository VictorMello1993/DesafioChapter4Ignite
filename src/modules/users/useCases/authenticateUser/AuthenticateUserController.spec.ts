import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database/index'

let connection: Connection;

describe('Authenticate user controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('It should be able to authenticate user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User test',
      email: 'test@test.com',
      password: '1234'
    })

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '1234'
    });

    expect(response.body).not.toBe({});
    expect(response.body).toHaveProperty('token');
    expect(response.status).toBe(200);
  })

  it('It should not be able to authenticate user if email is incorrect', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@test2.com',
      password: '1234'
    });

    expect(response.body).not.toBe({});
    expect(response.body).not.toHaveProperty('token');
    expect(response.status).toBe(401);
  })

  it('It should not be able to authenticate user if password is incorrect', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '123333'
    });

    expect(response.body).not.toBe({});
    expect(response.body).not.toHaveProperty('token');
    expect(response.status).toBe(401);
  })
})
