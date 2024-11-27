import { Response, Router } from 'express';
import { IRoute, ExpressReturnType } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IMiddleware } from './middleware.interface';

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

	public send<T>(res: Response, code: number, msg: T): ExpressReturnType {
		return res.status(code).json(msg);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			const middleware = route.middleware?.map((middleware: IMiddleware) =>
				middleware.execute.bind(middleware),
			);
			const pipeline = middleware ? [...middleware, route.func.bind(this)] : route.func.bind(this);
			this.logger.log(`Initializing route:[${route.method.toLocaleUpperCase()}] ${route.path}`);
			this.router[route.method](route.path, pipeline);
		}
	}
}
