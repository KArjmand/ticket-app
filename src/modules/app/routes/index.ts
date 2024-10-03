import type { NextFunction, Request, Response } from 'express';
import { authenticate } from '../../../constants/middlewares';
import { AuthController } from '../../auth/web/auth.controller';
import { TicketChatController } from '../../ticket/web/ticket-chat.controller';
import { TicketController } from '../../ticket/web/ticket.controller';

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
	middlewares?: Array<
		(request: Request, response: Response, next: NextFunction) => void
	>;
}> = [
	{
		method: 'get',
		route: '/auth',
		controller: AuthController,
		action: 'get',
	},
	{
		method: 'post',
		route: '/auth/login',
		controller: AuthController,
		action: 'login',
	},
	{
		method: 'get',
		route: '/tickets/:id',
		controller: TicketController,
		action: 'get',
		middlewares: [authenticate],
	},
	{
		method: 'get',
		route: '/tickets',
		controller: TicketController,
		action: 'all',
		middlewares: [authenticate],
	},
	{
		method: 'post',
		route: '/tickets/create',
		controller: TicketController,
		action: 'create',
		middlewares: [authenticate],
	},
	{
		method: 'post',
		route: '/tickets/close/:id',
		controller: TicketController,
		action: 'close',
		middlewares: [authenticate],
	},
	{
		method: 'post',
		route: '/tickets/open/:id',
		controller: TicketController,
		action: 'open',
		middlewares: [authenticate],
	},
	{
		method: 'post',
		route: '/tickets/chats/:ticketId',
		controller: TicketChatController,
		action: 'create',
		middlewares: [authenticate],
	},
	{
		method: 'get',
		route: '/tickets/chats/:ticketId',
		controller: TicketChatController,
		action: 'all',
		middlewares: [authenticate],
	},
];
