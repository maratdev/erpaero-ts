import express, {Express} from 'express'
import {Server} from 'http'
import {LoggerService} from "./logger/logger.service.js";
import {UsersController} from "./users/users.controller.js";
import {ExceptionFilter} from "./errors/exception.filter.js";


export class App {
    app: Express;
    port: number;
    server: Server | undefined
    logger: LoggerService;
    userController: UsersController;
    exceptionFilters: ExceptionFilter;

    constructor(
        logger: LoggerService,
        userController: UsersController,
        exceptionFilters: ExceptionFilter
    ) {
        this.logger = logger;
        this.app = express();
        this.port = 3000;
        this.userController = userController;
        this.exceptionFilters = exceptionFilters
    }

    useRoutes() {
        this.app.use('/users', this.userController.router)
    }
    useExceptionFilters() {
        this.app.use(this.exceptionFilters.catch.bind(this.exceptionFilters))
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port, () => {
            this.logger.log(`Server is running on port ${this.port}`)
        })
    }
}


