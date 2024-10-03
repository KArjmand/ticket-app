import { z } from 'zod';
import { NonEmptyString } from '../../../types/non-empty-string';
import { Ticket } from '../domain/ticket';

export type CreateTicketChatDto = z.TypeOf<typeof CreateTicketChatDto.schema>;
export namespace CreateTicketChatDto {
	export const schema = z.object({
		content: NonEmptyString.zod,
		ticketId: Ticket.Id.zod,
	});
	export const parse = (data: unknown): CreateTicketChatDto =>
		schema.parse(data);
}
