import {BaseController} from "../common/base.controller.js";
import {LoggerService} from "../logger/logger.service.js";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../errors/http-error.class.js";

export class UsersController extends BaseController {
    constructor(
        logger: LoggerService,
    ) {
        super(logger);
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

    login(req: Request, res: Response, next: NextFunction) {
        next(new HttpError(401, 'register', 'auth'));

    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')
    }
}