import type { Ticket } from '../../domain/ticket';

export namespace TicketResponse {
	export const mk = (ticket: Ticket) => ({
		_tag: ticket._tag,
		senderId: ticket.senderId,
		id: ticket.id,
		subject: ticket.subject,
		status: ticket.status,
		assign: [...ticket.assign],
		createdAt: ticket.createdAt,
		seenBy: [...ticket.seenBy],
		updatedAt: ticket.updatedAt,
		taker: {
			_tag: ticket.taker._tag,
			topic: ticket._tag === 'ByUser' ? ticket.taker.topic : undefined,
			userId: ticket._tag === 'ByOperator' ? ticket.taker.userId : undefined,
		},
	});
}
