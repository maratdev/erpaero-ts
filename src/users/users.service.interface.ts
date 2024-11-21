import { UserRegisterDto } from './dto/user-register';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login';

export interface IUsersService {
	create: (dto: UserRegisterDto) => Promise<User | undefined>;
	validate: (dto: UserLoginDto) => Promise<boolean>;
}
