import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../../../constants/errors';
import { UserAuth } from '../../auth/domain/user-auth';
import { Ticket } from '../domain/ticket';
import { CreateTicketDto } from '../dto/create.ticket.dto';
import { FindManyTicketDto } from '../dto/find-many-ticket.dto';
import { TicketService } from '../service/ticket.service';
import { TicketResponse } from './response/ticket.response';

export namespace TicketController {
	export const get = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const {
			userAuth,
			params: { id },
		} = request;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const ticketId = Ticket.Id.zod.parse(id);

		const ticket = await TicketService.findOne({
			id: ticketId,
			userAuth,
		});

		if (UserAuth.isOperator(userAuth) && ticket.assign.size === 0)
			await TicketService.update({
				id: ticketId,
				userAuth,
				assign: new Set([userAuth.id]),
			});

		return TicketResponse.mk(ticket);
	};
	export const all = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const { userAuth } = request;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const { items, meta } = await TicketService.findAndPaginate({
			dto: FindManyTicketDto.parse({
				filter: request.query.filter || {},
				paginate: request.query.paginate,
			}),
			userAuth,
		});
		return {
			items: items.map((t) => TicketResponse.mk(t)),
			meta,
		};
	};

	export const create = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const userAuth = request.userAuth;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const dto = CreateTicketDto.parse({
			...request.body,
			_tag: UserAuth.isOperator(userAuth) ? 'ByOperator' : 'ByUser',
		});
		const ticket = await TicketService.create({
			dto,
			userAuth,
		});
		return TicketResponse.mk(ticket);
	};

	export const close = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const { userAuth } = request;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const { id } = request.params;
		const result = await TicketService.close({
			id: Ticket.Id.zod.parse({ id }),
			userAuth,
		});

		return TicketResponse.mk(result);
	};

	export const open = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const { userAuth } = request;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const { id } = request.params;

		const result = await TicketService.open({
			id: Ticket.Id.zod.parse({ id }),
			userAuth,
		});

		return TicketResponse.mk(result);
	};
}
