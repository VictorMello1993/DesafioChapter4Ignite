import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('It should be able to create a new user', async() => {
    const user = await createUserUseCase.execute({
      name: 'User name',
      email: 'test@test.com',
      password: '1234'
    });

    expect(user).toHaveProperty('id');
  });

  it('It should not be able to create user with the same e-mail', async() => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'User 1',
        email: 'test@test.com',
        password: '1234'
      });

      await createUserUseCase.execute({
        name: 'User 2',
        email: 'test@test.com',
        password: '1234'
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
});
