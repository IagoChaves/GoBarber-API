import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      name: 'John Trê',
      email: 'teste@gmail.com',
      user_id: user.id,
    });
    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('teste@gmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      email: 'test@gmail.com',
      name: 'John Test',
      password: '123456',
    });
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'iagovieirachaves@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      name: 'John Trê',
      email: 'teste@gmail.com',
      user_id: user.id,
      password: '123123',
      old_password: '123456',
    });
    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      email: 'test@gmail.com',
      name: 'John Test',
      password: '123456',
    });
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'iagovieirachaves@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        name: 'John Trê',
        email: 'teste@gmail.com',
        user_id: user.id,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'iagovieirachaves@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        name: 'John Trê',
        email: 'teste@gmail.com',
        old_password: 'wrong-old-password',
        user_id: user.id,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not able to update the profile to a not existing user', async () => {
    expect(
      updateProfile.execute({
        email: 'test@example.com',
        name: 'tey',
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
