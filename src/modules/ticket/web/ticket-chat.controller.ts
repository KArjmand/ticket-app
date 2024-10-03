import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../../../constants/errors';
import { Ticket } from '../domain/ticket';
import { CreateTicketChatDto } from '../dto/create-ticket-chat.dto';
import { TicketChatService } from '../service/ticket-chat.service';
import { TicketService } from '../service/ticket.service';
import { TicketChatResponse } from './response/ticket-chat.response';

export namespace TicketChatController {
	export const create = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const { userAuth } = request;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const dto = CreateTicketChatDto.parse({
			...request.body,
			ticketId: request.params.ticketId,
		});

		const chat = await TicketChatService.add({
			dto,
			userAuth,
		});

		return chat;
	};

	export const all = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const { userAuth } = request;
		if (!userAuth) throw new ForbiddenError('SufficientPermission');
		const { chats, ticket } = await TicketChatService.findAllByTicketId({
			id: Ticket.Id.zod.parse(request.params.ticketId),
			userAuth,
		});
		TicketService.seen({ data: { chats, ticket }, userAuth });
		return TicketChatResponse.mk({ chats, ticket });
	};
}
