import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database/index'
import { OperationType } from '../../entities/Statement';

let connection: Connection;

describe('Get balance controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('It should be able to get balance', async () => {
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

    await request(app).post('/api/v1/statements/deposit').send({
      amount: 800,
      description: 'Deposit test 1',
      type:  OperationType.DEPOSIT
    }).set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post('/api/v1/statements/withdraw').send({
      amount: 200,
      description: 'Withdraw test 1',
      type:  OperationType.WITHDRAW
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).not.toBe({});
    expect(response.body).toHaveProperty('balance');
    expect(response.status).toBe(200);
  })

  it('It should not be able to get balance if user does not exist', async () => {
    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer invalid_token`
    });

    expect(response.body).not.toBe({});
    expect(response.status).toBe(401);
  })
})
