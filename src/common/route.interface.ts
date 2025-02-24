import {NextFunction, Request, Response, Router} from "express";

export interface IRoute {
    path: string;
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
}