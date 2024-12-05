import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login';
import { UserRegisterDto } from './dto/user-register';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { IUsersService } from './users.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) loggerService: ILogger,
		@inject(TYPES.UserService) private readonly userService: IUsersService,
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middleware: [new AuthGuard()],
			},
		]);
	}

	async login(
		req: Request<any, any, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.validate(req.body);
		if (!newUser) return next(new HttpError(401, 'Error authorization', 'login'));
		const token = await this.signJWT(req.body.email, this.configService.get('JWT_SECRET'));
		this.ok(res, { token });
	}

	async register(
		{ body }: Request<any, any, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.create(body);
		if (!newUser) return next(new HttpError(422, 'Такой пользователь уже существует', 'auth'));
		this.ok(res, newUser);
	}

	async info({ user }: Request, res: Response): Promise<void> {
		const { email, id } = await this.userService.getUserInfo(user);
		this.ok(res, { email, id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.sign(
				{
					email: email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) reject(err);
					resolve(token as string);
				},
			);
		});
	}
}
