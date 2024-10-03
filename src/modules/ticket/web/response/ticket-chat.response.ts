import type { TicketChat } from '../../domain/chat';
import type { AllTicketChats } from '../../domain/ticket';
import { TicketResponse } from './ticket.response';

export namespace TicketChatResponse {
	export const mkChats = (c: TicketChat[]) => {
		return c.map((c) => ({
			_tag: c._tag,
			id: c.id,
			content: c.content,
			createdAt: c.createdAt,
		}));
	};
	export const mk = (data: AllTicketChats) => {
		return {
			chats: mkChats(data.chats),
			ticket: TicketResponse.mk(data.ticket),
		};
	};
}
