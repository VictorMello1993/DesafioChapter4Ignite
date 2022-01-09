import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database/index'
import { OperationType } from '../../entities/Statement';
import {v4 as uuid} from 'uuid'

let connection: Connection;

describe('Get statement operation by controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('It should be able to get a statement operation by id', async () => {
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

    const responseStatement = await request(app).post('/api/v1/statements/deposit').send({
      amount: 800,
      description: 'Deposit test 1',
      type:  OperationType.DEPOSIT
    }).set({
      Authorization: `Bearer ${token}`
    });

    const {id} = responseStatement.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).not.toBe({});
    expect(response.body).toHaveProperty('id');
    expect(response.status).toBe(200);
  })

  it('It should not be able to get a statement operation by id if it does not exist', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '1234'
    });

    const {token} = responseToken.body;

    const id = uuid();

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).not.toBe({});
    expect(response.status).toBe(404);
  })
})
