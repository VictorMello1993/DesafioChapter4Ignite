import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser//CreateUserUseCase";
import { CreateStatementUseCase } from "../../../statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

describe('Get balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it("It should be able to list user's balance", async() => {
    const user = await createUserUseCase.execute({
      name: 'user name',
      email: 'test@test.com',
      password: '1234'
    })

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 800,
      description: 'deposit test'
    })

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1200,
      description: 'deposit test2'
    })

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 400,
      description: 'withdraw test'
    })

    const balance = await getBalanceUseCase.execute({user_id: user.id})

    expect(balance).toHaveProperty('balance');

  })

  it("It should not be able to list a non-exist user's balance", async() => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: 'blabla'})
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
