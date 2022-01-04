import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
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
});
