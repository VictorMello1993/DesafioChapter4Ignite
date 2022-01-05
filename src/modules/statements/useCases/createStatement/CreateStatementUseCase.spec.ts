import { InMemoryStatementsRepository } from "modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "modules/users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

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

  it('It should be able to create a new statement', async () => {
    // const user = await createUserUseCase.execute({
    //   name: 'User name',
    //   email: 'test@test.com',
    //   password: '1234'
    // });

    // await createStatementUseCase.execute(
    //   { user_id: user.id,
    //     type: 'deposit'
    //     amount: 800,
    //     description: 'deposit test'
    //   })

  })
})
