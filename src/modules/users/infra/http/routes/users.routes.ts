import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadconfig from '@config/Upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersController from '../Controllers/UsersController';
import UserAvatarController from '../Controllers/UserAvatarController';

const UsersRouter = Router();
const upload = multer(uploadconfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

UsersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

UsersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default UsersRouter;
