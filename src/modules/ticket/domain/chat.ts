import { IdMaker } from '../../../types/id-maker';
import type { NonEmptyString } from '../../../types/non-empty-string';
import type { TicketId } from './ticket';

export type TicketChat = TicketChat.T;
export type TicketChatId = TicketChat.Id;
export namespace TicketChat {
	export const Id = IdMaker.mk<'TicketChatId'>();
	export type Id = IdMaker.Infer<typeof Id>;

	export interface T {
		id: Id;
		ticketId: TicketId;
		content: NonEmptyString;
		createdAt: Date;
		_tag: 'ByTaker' | 'BySender';
	}
}
