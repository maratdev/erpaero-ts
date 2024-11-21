import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register';
import { UserLoginDto } from './dto/user-login';
import { User } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class UsersService implements IUsersService {
	async create({ email, password, name }: UserRegisterDto): Promise<User | undefined> {
		const newUser = new User(email, name);
		await newUser.getPassword(password);
	}

	async validate(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
