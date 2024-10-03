import type { NextFunction, Request, Response } from 'express';
import { AuthController } from '../../auth/web/auth.controller';

export const Routes: Array<{
	method: 'get' | 'post' | 'put' | 'delete';
	route: `/${string}`;
	controller: Record<
		string,
		(
			request: Request,
			response: Response,
			next: NextFunction,
		) => unknown | Promise<unknown>
	>;
	action: string;
}> = [
	{
		method: 'get' as const,
		route: '/auth',
		controller: AuthController,
		action: 'get',
	},
	{
		method: 'post' as const,
		route: '/auth/login',
		controller: AuthController,
		action: 'login',
	},
];
