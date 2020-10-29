import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;
describe('List Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able list the profiles', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      email: 'teste@gmail.com',
      name: 'John Trê',
      password: '123456',
    });
    const loggedUser = await fakeUsersRepository.create({
      email: 'teste2@gmail.com',
      name: 'John Qua',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
