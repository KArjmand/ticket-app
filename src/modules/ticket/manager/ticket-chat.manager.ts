import type { FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../../db/data-source';
import { NaturalNumber } from '../../../types/natural-number';
import { type Paginate, PaginationResult } from '../../../types/paginate';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { TicketChat } from '../domain/chat';
import type { CreateTicketChat } from '../domain/create-ticket-chat';
import type { Ticket } from '../domain/ticket';
import { TicketChatEntity } from './ticket-chat.entity';

export namespace TicketChatManager {
	const ticketChatRepository = AppDataSource.getRepository(TicketChatEntity);

	export const add = async (data: CreateTicketChat) => {
		const {
			content,
			userId,
			_tag,
			ticket: { id: ticketId },
		} = data;
		const saved = await ticketChatRepository.save({
			content,
			ticketId,
			_tag,
			userId,
		});
		return ticketChatRepository
			.findOneByOrFail({ id: saved.id })
			.then((x) => x.toChat());
	};

	export const findAndPaginate = async ({
		ticket,
		paginate,
	}: {
		ticket: Ticket;
		paginate: Paginate;
		userAuth: UserAuth;
	}): Promise<PaginationResult<TicketChat>> => {
		const where: FindOptionsWhere<TicketChatEntity> = {
			ticketId: ticket.id,
		};

		const [items, count] = await ticketChatRepository.findAndCount({
			where,
			...paginate,
		});
		return PaginationResult.mk({
			items: items.map((chat) => chat.toChat()),
			count: NaturalNumber.mkUnsafe(count),
			paginate,
		});
	};

	export const findAllByTicketId = async ({
		ticket,
		userAuth,
	}: {
		ticket: Ticket;
		userAuth: UserAuth;
	}) => {
		const chats = await ticketChatRepository.find({
			where: { ticketId: ticket.id },
		});
		if (!chats) return undefined;

		return chats.map((x) => x.toChat());
	};
}
