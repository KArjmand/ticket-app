import { ForbiddenError } from '../../../constants/errors';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { TicketChat } from '../domain/chat';
import { CreateTicketChat } from '../domain/create-ticket-chat';
import { type AllTicketChats, Ticket } from '../domain/ticket';
import type { CreateTicketChatDto } from '../dto/create-ticket-chat.dto';
import type { FindManyTicketChatDto } from '../dto/find-many-ticket-chat.dto';
import { TicketChatManager } from '../manager/ticket-chat.manager';
import { TicketService } from './ticket.service';

export namespace TicketChatService {
	TicketChatManager;
	TicketService;

	export const add = async ({
		dto,
		userAuth,
	}: {
		dto: CreateTicketChatDto;
		userAuth: UserAuth;
	}): Promise<TicketChat> => {
		const ticket = await TicketService.findOne({
			id: dto.ticketId,
			userAuth,
		});

		if (!Ticket.NotClose.is(ticket))
			throw new ForbiddenError('TicketAlreadyClose');

		const data = CreateTicketChat.mkUnsafe({ dto, userAuth, ticket });
		const chat = await TicketChatManager.add(data);
		return chat;
	};

	export const findAndPaginate = async ({
		dto,
		userAuth,
	}: {
		dto: FindManyTicketChatDto;
		userAuth: UserAuth;
	}) => {
		const ticket = await TicketService.findOne({
			id: dto.filter.ticketId,
			userAuth,
		});

		const { items, meta } = await TicketChatManager.findAndPaginate({
			ticket,
			paginate: dto.paginate,
			userAuth,
		});

		return {
			items,
			meta,
		};
	};

	export const findAllByTicketId = async ({
		id,
		userAuth,
	}: {
		id: Ticket.Id;
		userAuth: UserAuth;
	}): Promise<AllTicketChats> => {
		const ticket = await TicketService.findOne({
			id,
			userAuth,
		});

		const chats = await TicketChatManager.findAllByTicketId({
			ticket,
			userAuth,
		});

		if (!chats) throw new ForbiddenError('TicketChatsNotFound');

		return {
			ticket,
			chats,
		};
	};
}
