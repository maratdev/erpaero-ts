import { UserRegisterDto } from './dto/user-register';
import { UserLoginDto } from './dto/user-login';
import { UserModel } from '@prisma/client';

export interface IUsersService {
	create: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validate: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
