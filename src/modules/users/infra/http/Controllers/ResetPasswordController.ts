import { Response, Request } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

import { container } from 'tsyringe';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    resetPassword.execute({
      password,
      token,
    });

    return response.status(204).json();
  }
}
