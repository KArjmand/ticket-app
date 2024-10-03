import { match } from 'ts-pattern';
import { ForbiddenError } from '../../../constants/errors';
import type { NonEmptyString } from '../../../types/non-empty-string';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { UserId } from '../../user/domain/user';
import type { CreateTicketChatDto } from '../dto/create-ticket-chat.dto';
import { Ticket } from './ticket';

export type CreateTicketChat =
	| CreateTicketChat.BySender
	| CreateTicketChat.ByTaker;

export namespace CreateTicketChat {
	export interface Base {
		content: NonEmptyString;
		userId: UserId;
		_tag: 'ByTaker' | 'BySender';
	}

	export interface ByTaker extends Base {
		_tag: 'ByTaker';
		status: Ticket.Status.TakerResponse;
		ticket: Ticket.NotClose;
	}

	export interface BySender extends Base {
		_tag: 'BySender';
		status: Ticket.Status.SenderResponse;
		ticket: Ticket.NotClose;
	}

	export const mkUnsafe = ({
		ticket,
		userAuth,
		dto,
	}: {
		ticket: Ticket.NotClose;
		userAuth: UserAuth;
		dto: CreateTicketChatDto;
	}): CreateTicketChat => {
		const base = {
			content: dto.content,
			userId: userAuth.id,
			ticket,
		};

		return match([userAuth, ticket])
			.with(
				[{ _tag: 'User' }, { _tag: 'ByUser' }],
				([userAuth, ticket]): BySender => {
					if (userAuth.id !== ticket.senderId) {
						throw new ForbiddenError('AccessibleTicket');
					}
					return {
						...base,
						status: Ticket.Status.Enum.SenderResponse,
						_tag: 'BySender',
					};
				},
			)
			.with(
				[{ _tag: 'User' }, { _tag: 'ByOperator' }],
				([userAuth, ticket]): ByTaker => {
					if (ticket.taker.userId !== userAuth.id) {
						throw new ForbiddenError('AccessibleTicket');
					}
					return {
						...base,
						_tag: 'ByTaker',
						status: Ticket.Status.Enum.TakerResponse,
					};
				},
			)
			.with(
				[{ _tag: 'Operator' }, { _tag: 'ByOperator' }],
				([userAuth, ticket]): BySender => {
					if (userAuth.id !== ticket.senderId) {
						// UserPermission.mkUnsafe('manage_ticket', userAuth);
					}
					return {
						...base,
						_tag: 'BySender',
						status: Ticket.Status.Enum.SenderResponse,
					};
				},
			)
			.with(
				[{ _tag: 'Operator' }, { _tag: 'ByUser' }],
				([userAuth, ticket]): ByTaker => {
					if (![...ticket.assign].includes(userAuth.id)) {
						// UserPermission.mkUnsafe('manage_ticket', userAuth);
					}
					return {
						...base,
						_tag: 'ByTaker',
						status: Ticket.Status.Enum.TakerResponse,
					};
				},
			)
			.otherwise(() => {
				throw new ForbiddenError('AccessibleTicket');
			});
	};
}
