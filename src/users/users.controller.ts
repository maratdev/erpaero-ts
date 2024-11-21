import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login';
import { UserRegisterDto } from './dto/user-register';
import { UsersService } from './users.service';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) loggerService: ILogger,
		@inject(TYPES.UserService) private readonly userService: UsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
		]);
	}

	login(req: Request<any, any, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HttpError(401, 'register', 'auth'));
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
}
