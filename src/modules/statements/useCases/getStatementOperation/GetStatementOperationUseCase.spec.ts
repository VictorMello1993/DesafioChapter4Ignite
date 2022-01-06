import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "../../../statements/useCases/createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

describe('Get statement operation', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it('It should be able to get a statement operation', async() => {
    const user = await createUserUseCase.execute({
      name: 'User name',
      email: 'test@test.com',
      password: '1234'
    })

    const statement  = await createStatementUseCase.execute(
      { user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 800,
        description: 'deposit test'
      })

    const operation = await getStatementOperationUseCase.execute({user_id: user.id, statement_id: statement.id});

    expect(operation).toHaveProperty('id');
    expect(operation).toHaveProperty('user_id');
  })

  it('It should not be able to get a statement operation if user does not exist', async() => {
      // Será implementado depois
  })

  it('It should not be able to get a statement operation if statement itself does not exist', async() => {
    // Será implementado depois
})
})
