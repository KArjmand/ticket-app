import z from 'zod';
import { Paginate } from '../../../types/paginate';
import { Ticket } from '../domain/ticket';

export type FindManyTicketChatDto = FindManyTicketChatDto.FindManyTicketChatDto;
export namespace FindManyTicketChatDto {
	const filter = z.object({
		ticketId: Ticket.Id.zod,
	});

	export type Filter = z.TypeOf<typeof filter>;

	export type FindManyTicketChatDto = z.TypeOf<typeof schema>;

	const schema = z.object({
		filter,
		paginate: Paginate.zod,
	});

	export const parse = (data: unknown): FindManyTicketChatDto =>
		schema.parse(data);
}
