import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { UserRegisterDto } from './dto/user-register';
import { UserLoginDto } from './dto/user-login';
import { User } from './user.entity';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
		@inject(TYPES.UsersRepository) private readonly usersRepository: IUsersRepository,
	) {}

	async create({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existingUser = await this.usersRepository.find(email);
		if (existingUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validate({ email, password }: UserLoginDto): Promise<boolean> {
		const existingUser = await this.usersRepository.find(email);
		if (!existingUser) {
			return false;
		}
		const newUser = new User(existingUser?.email, existingUser?.name, existingUser?.password);
		return newUser.comparePassword(password);
	}
	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
