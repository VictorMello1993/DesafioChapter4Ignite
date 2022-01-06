import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../showUserProfile/ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show user profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it('It should be able to list user profile', async() => {
    const user = await createUserUseCase.execute({
      name: 'User name',
      email: 'test@test.com',
      password: '1234'
    });

    const userExists = await showUserProfileUseCase.execute(user.id);

    expect(userExists).toEqual(user)

  });

  it('It should not be able to list non-exist user profile', async() => {
    expect(async () => {
      await showUserProfileUseCase.execute('blabla')
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
