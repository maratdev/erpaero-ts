import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			jwt.verify(req.headers.authorization.split(' ')[1], this.secret, (err, decoded: any) => {
				if (err) {
					next();
				} else if (decoded) {
					req.user = decoded.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
