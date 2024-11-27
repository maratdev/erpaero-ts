import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { UsersService } from './users/users.service';
import { IUsersService } from './users/users.service.interface';
import { IUserController } from './users/users.controller.interface';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UsersController);
	bind<IUsersService>(TYPES.UserService).to(UsersService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
