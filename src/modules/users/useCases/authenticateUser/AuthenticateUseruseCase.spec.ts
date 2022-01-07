import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('It should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'User name',
      email: 'teste@teste.com',
      password: '1234'
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({email: user.email, password: user.password});

    expect(result).toHaveProperty('token');
  });

  it('It should not be able to authenticate an incorrect user', async() => {
    expect(async () => {
      await authenticateUserUseCase.execute({email: 'incorrectEmail@test.com', password: 'blabla'})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it('It should not be able to authenticate an incorrect user password', async() => {
    const user = await createUserUseCase.execute({
      name: 'User name',
      email: 'test@test.com',
      password: '1234'
    });

    expect(async () => {
      await authenticateUserUseCase.execute({email: user.email, password: 'blabla'})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
});


