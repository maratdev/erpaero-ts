import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { UsersController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private readonly logger: ILogger,
		@inject(TYPES.UserController) private readonly userController: UsersController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
		@inject(TYPES.PrismaService) private readonly prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 3000;
	}

	useMiddleware(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server is running on port ${this.port}`);
		});
	}
}
