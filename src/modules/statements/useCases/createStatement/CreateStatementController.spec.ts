import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm'
import createConnection from '../../../../database/index'
import { OperationType } from '../../entities/Statement';
import { ICreateStatementDTO } from './ICreateStatementDTO';

let connection: Connection;

describe('Create statement controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('It should be able to create a deposit statement', async () => {
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

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 800,
      description: 'Deposit test 1',
      type:  OperationType.DEPOSIT
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).not.toBe({});
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('deposit');
    expect(response.status).toBe(201);
  })

  it('It should be able to create a withdraw statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '1234'
    });

    const {token} = responseToken.body;

    const withdraw: ICreateStatementDTO = {
        user_id: responseToken.body.user.id,
        amount: 200,
        description: 'Withdraw test 1',
        type:  OperationType.WITHDRAW
    }

    const response = await request(app).post('/api/v1/statements/withdraw').send(withdraw).set({
      Authorization: `Bearer ${token}`
    })

    const responseBalance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).not.toBe({});
    expect(responseBalance.body.balance).toBeGreaterThanOrEqual(withdraw.amount);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('withdraw');
    expect(response.status).toBe(201);
  })

  it('It should not be able to create a deposit statement if user does not exists', async () => {
    const response = await request(app).post('/api/v1/statements/deposit').set({
      amount: 800,
      description: 'Deposit test 1',
      type:  OperationType.DEPOSIT
    }).set({
      Authorization: `Bearer invalid_token`
    });

    expect(response.body).not.toBe({});
    expect(response.status).toBe(401);
  })

  it('It should not be able to create a withdraw statement if user does not exists', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '1234'
    });

    const withdraw: ICreateStatementDTO = {
      user_id: 'blabla',
      amount: 200,
      description: 'Withdraw test 1',
      type:  OperationType.WITHDRAW
    }

    const response = await request(app).post('/api/v1/statements/withdraw').set({
      amount: 200,
      description: 'Withdraw test 1',
      type:  OperationType.WITHDRAW
    }).set({
      Authorization: `Bearer invalid_token`
    });

    expect(response.body).not.toBe({});
    expect(response.status).toBe(401);
  })

  it('It should not be able to create a withdraw statement if there are not enough funds', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com',
      password: '1234'
    });

    const withdraw: ICreateStatementDTO = {
      user_id: responseToken.body.user.id,
      amount: 5000,
      description: 'Withdraw test 1',
      type:  OperationType.WITHDRAW
    }

    const {token} = responseToken.body;

    const responseBalance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app).post('/api/v1/statements/withdraw').send(withdraw).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).not.toBe({});
    expect(responseBalance.body.balance).toBeLessThan(withdraw.amount);
    expect(responseBalance.body).toHaveProperty('balance');
    expect(response.status).toBe(400);
  })
})
