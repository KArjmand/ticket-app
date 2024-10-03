import bodyParser from 'body-parser';
import express, {
	type NextFunction,
	type Request,
	type Response,
} from 'express';
import { ZodError } from 'zod';
import type { ForbiddenError, NotFoundError } from './constants/errors';
import AppDataSource from './db/data-source';
import { NODE_ENV, PORT } from './environments';
import { Routes } from './modules/app/routes';

const main = async () => {
	await AppDataSource.initialize();
	// configures dotenv to work in your application
	const app = express();
	app.use(bodyParser.json());
	app.use(
		(
			err: NotFoundError | ForbiddenError,
			req: Request,
			res: Response,
			next: NextFunction,
		) => {
			res.status(err.statusCode || 500).json({
				message: err.message,
				stack: NODE_ENV === 'production' ? '🥞' : err.stack,
			});
		},
	);
	// register express routes from defined application routes
	for (const route of Routes) {
		app[route.method](
			route.route,
			...(route?.middlewares || []),
			(req: Request, res: Response, next: NextFunction) => {
				const result = route.controller[route.action](req, res, next);
				if (result instanceof Promise) {
					result
						.then((result) =>
							result !== null && result !== undefined
								? res.send(result)
								: undefined,
						)
						.catch((err) => {
							console.log({ err });
							if (err instanceof ZodError) {
								return res.status(400).send({
									message: 'Validation error',
									errors: err.issues,
								});
							}
							res.status(err.statusCode || 500).send({
								error: err.message,
								message: err.message,
							});
						});
				} else if (result !== null && result !== undefined) {
					res.json(result);
				}
			},
		);
	}

	app
		.listen(PORT, () => {
			console.log('Server running at PORT: ', PORT);
		})
		.on('error', (error) => {
			// gracefully handle error
			// throw new Error(error.message);
			console.error(error.message);
		});
};

main();
