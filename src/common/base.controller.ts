import { Response, Router } from 'express';
import { IRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

export { Router } from 'express';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private readonly logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, msg: T): Response {
		return res.status(code).json(msg);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`Initializing route:[${route.method.toLocaleUpperCase()}] ${route.path}`);
			this.router[route.method](route.path, route.func.bind(this));
		}
	}
}
