import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser//CreateUserUseCase";
import { TransferBetweenAccountsUseCase } from "../transferBetweenAccounts/TransferBetweenAccountsUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let transferBetweenAccountsUseCase: TransferBetweenAccountsUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Transfer between accounts', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    transferBetweenAccountsUseCase = new TransferBetweenAccountsUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it('It should be able to transfer between accounts', async () => {
    //Será implementado depois.
  })
})
