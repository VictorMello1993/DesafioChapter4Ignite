import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser//CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { TransferBetweenAccountsUseCase } from "../transferBetweenAccounts/TransferBetweenAccountsUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let transferBetweenAccountsUseCase: TransferBetweenAccountsUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Transfer between accounts', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    transferBetweenAccountsUseCase = new TransferBetweenAccountsUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it('It should be able to transfer between accounts', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@test.com',
      password: '1234'
    })

    const destinationUser = await createUserUseCase.execute({
      name: 'User 2',
      email: 'user2@test.com',
      password: '4321'
    })

    const inputData = {
      amount: 200,
      description: 'transfer test',
      sender_id: senderUser.id,
      destination_user_id: destinationUser.id
    }

    await createStatementUseCase.execute({
      user_id: senderUser.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'deposit test'
    })

    await createStatementUseCase.execute({
      user_id: destinationUser.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'deposit test'
    })

    const {balance} = await statementsRepositoryInMemory.getUserBalance({user_id: senderUser.id});

    const result = await transferBetweenAccountsUseCase.execute(inputData);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(inputData.amount).toBeLessThan(balance);
    expect(result.transfer_in).toHaveProperty('sender_id');
    expect(result.transfer_out).toHaveProperty('sender_id');
    expect(result.transfer_in.type).toBe('transfer_in');
    expect(result.transfer_out.type).toBe('transfer_out');
  })

  it('It should not be able to transfer if user sender does not exist', async () => {
    const destinationUser = await createUserUseCase.execute({
      name: 'User 2',
      email: 'user2@test.com',
      password: '4321'
    });

    await expect(
      transferBetweenAccountsUseCase.execute({
        amount: 200,
        description: 'transfer test',
        sender_id: 'aabb',
        destination_user_id: destinationUser.id
      })
    ).rejects.toEqual(new AppError('User not found', 404))
  })

  it('It should not be able to transfer if destination user does not exist', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@test.com',
      password: '1234'
    });

    await expect(
      transferBetweenAccountsUseCase.execute({
        amount: 200,
        description: 'transfer test',
        sender_id: senderUser.id,
        destination_user_id: 'asdiohsahdsahdk'
      })
    ).rejects.toEqual(new AppError('User not found', 404))
  })

  it('It should not be able to transfer if user sender does not have enough funds', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@test.com',
      password: '1234'
    })

    const destinationUser = await createUserUseCase.execute({
      name: 'User 2',
      email: 'user2@test.com',
      password: '4321'
    })

    const inputData = {
      amount: 1000,
      description: 'transfer test',
      sender_id: senderUser.id,
      destination_user_id: destinationUser.id
    }

    await createStatementUseCase.execute({
      user_id: senderUser.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'deposit test'
    })

    await createStatementUseCase.execute({
      user_id: destinationUser.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'deposit test'
    })

    await expect(transferBetweenAccountsUseCase.execute(inputData))
         .rejects.toEqual(new AppError('Insufficient funds'))

  })

  it('It should not be able to transfer if user sender is destination user', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@test.com',
      password: '1234'
    })

    const inputData = {
      amount: 200,
      description: 'transfer test',
      sender_id: senderUser.id,
      destination_user_id: senderUser.id
    }

    await createStatementUseCase.execute({
      user_id: senderUser.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'deposit test'
    })

    await expect(transferBetweenAccountsUseCase.execute(inputData))
         .rejects.toEqual(new AppError('Sender user is receiver user'))

  })
})
