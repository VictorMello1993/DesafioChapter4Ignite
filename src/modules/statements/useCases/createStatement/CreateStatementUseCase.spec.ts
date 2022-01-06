import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import exp from "constants"
import { CreateStatementError } from "./CreateStatementError"

let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

describe('Create statement', () => {
beforeEach(() => {
  usersRepositoryInMemory = new InMemoryUsersRepository();
  statementsRepository = new InMemoryStatementsRepository();
  createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository);
  });

  it('It should be able to create a deposit statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'User name',
      email: 'test@test.com',
      password: '1234'
    });

    const statement  = await createStatementUseCase.execute(
      { user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 800,
        description: 'deposit test'
      })

      expect(statement).toHaveProperty('id');
      expect(statement.type).toEqual('deposit');
  })

  it('It should be able to create a withdraw statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'User name',
      email: 'test@test.com',
      password: '1234'
    });

    await createStatementUseCase.execute(
      { user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 800,
        description: 'deposit test'
      })

    const statement = await createStatementUseCase.execute(
      { user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: 'withdraw test'
      })

      expect(statement).toHaveProperty('id');
      expect(statement.type).toEqual('withdraw');
  })

  it('It should not be able to create a statement with non-exist user', async () => {
    expect(async () => {
      await createStatementUseCase.execute(
        { user_id: 'aabbc',
          type: OperationType.DEPOSIT,
          amount: 800,
          description: 'deposit test'
        })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it('It should not be able to create a withdraw statement if the balance is less than amount', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User name',
        email: 'test@test.com',
        password: '1234'
      })

      await createStatementUseCase.execute(
        { user_id: user.id,
          type: OperationType.DEPOSIT,
          amount: 800,
          description: 'deposit test'
        })

      await createStatementUseCase.execute(
        { user_id: user.id,
          type: OperationType.WITHDRAW,
          amount: 1200,
          description: 'withdraw test'
        })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
