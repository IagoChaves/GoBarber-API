import { sign } from 'jsonwebtoken';
import User from '@modules/users/infra/typeorm/entities/User';
import AuthConfig from '@config/Auth';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  email: string;
  password: string;
}
interface IResponseDTO {
  user: User;
  token: string;
}
@injectable()
class AuthenticateUserService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    email,
    password,
  }: IRequestDTO): Promise<IResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect Email/Password combination', 401);
    }
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect Email/Password combination', 401);
    }
    const token = sign({}, `${AuthConfig.jwt.secret}`, {
      subject: user.id,
      expiresIn: AuthConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}
export default AuthenticateUserService;
