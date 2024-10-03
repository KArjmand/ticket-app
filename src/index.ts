import http from 'node:http';
import bodyParser from 'body-parser';
import express, {
	type NextFunction,
	type Request,
	type Response,
	type Express,
} from 'express';
import { type Socket, Server as SocketIOServer } from 'socket.io';
import { ZodError } from 'zod';
import { appEventEmitter } from './constants/app-event';
import type { ForbiddenError, NotFoundError } from './constants/errors';
import { socketAuthenticate } from './constants/middlewares';
import AppDataSource from './db/data-source';
import { NODE_ENV, PORT } from './environments';
import { Routes } from './modules/app/routes';
import { AccessToken } from './modules/auth/domain/access-token';

const main = async () => {
	await AppDataSource.initialize();
	// configures dotenv to work in your application
	const app: Express = express();
	const server = http.createServer(app);

	const io = new SocketIOServer(server, {
		cors: {
			origin: '*',
		},
	});
	io.use(socketAuthenticate);
	handel(io);
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

	server
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

const handel = (io: SocketIOServer) => {
	const CURRENT_USER_SOCKETS: Map<string, Set<string>> = new Map();

	// Socket.IO event handlers
	io.on('connection', (socket: Socket) => {
		const { userAuth } = socket.data;

		const preUserSocket = CURRENT_USER_SOCKETS.get(userAuth.id);

		CURRENT_USER_SOCKETS.set(
			userAuth.id,
			new Set([socket.id, ...(preUserSocket ? preUserSocket : [])]),
		);

		socket.on('ping', () => {
			socket.emit('pong', { payload: { value: 'pong' } });
		});

		appEventEmitter.on('ticket-chat-added', (data) => {
			if (data.chat._tag === 'ByTaker') {
				const sId = CURRENT_USER_SOCKETS.get(data.ticket.senderId);
				if (sId) {
					for (const id of sId) {
						socket.to(id).emit('new-ticket-chat', {
							ticket: data.ticket,
							chat: data.chat,
						});
					}
				}
				return;
			}
			for (const userId of data.ticket.assign) {
				const sId = CURRENT_USER_SOCKETS.get(userId);

				if (sId) {
					for (const id of sId) {
						socket.to(id).emit('new-ticket-chat', {
							ticket: data.ticket,
							chat: data.chat,
						});
					}
				}
			}
		});
		socket.on('disconnect', () => {
			const socketId = socket.id;
			const preUserSocket = CURRENT_USER_SOCKETS.get(userAuth.id);

			if (preUserSocket?.size) {
				preUserSocket.delete(socketId);
				CURRENT_USER_SOCKETS.set(userAuth.id, new Set([...preUserSocket]));
			}
		});
	});
};
