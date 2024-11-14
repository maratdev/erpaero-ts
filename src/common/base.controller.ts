import { Router, Response,} from "express";
import { LoggerService } from "../logger/logger.service";
import {IRoute} from "./route.interface.js";
export { Router } from 'express';

export abstract class BaseController {
    private readonly _router: Router;

    protected constructor(
        private readonly logger: LoggerService,
    ) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }
    public send<T>(res: Response, code: number, msg: T) {
        return res.status(code).json(msg)
    }

    public ok<T>(res: Response, message: T){
        return this.send<T>(res, 200, message);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }
    protected bindRoutes(routes: IRoute[]): void {
        for (const route of routes) {
            this.logger.log(`Initializing route:[${route.method.toLocaleUpperCase()}] ${route.path}`);
            this.router[route.method](route.path, route.func.bind(this));
        }

    }
}