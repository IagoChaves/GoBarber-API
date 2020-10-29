import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsers: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUsers = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new User', async () => {
    const user = await createUsers.execute({
      name: 'Iago Chaves',
      email: 'iagovieirachaves@gmail.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new User with the same email', async () => {
    await createUsers.execute({
      name: 'Iago Chaves',
      email: 'iagovieirachaves@gmail.com',
      password: '123456',
    });
    await expect(
      createUsers.execute({
        name: 'Iago Chaves',
        email: 'iagovieirachaves@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to create a new User with a invalid email', async () => {
    await expect(
      createUsers.execute({
        email: 'trotos',
        name: 'John Cena',
        password: 'repertorio',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
