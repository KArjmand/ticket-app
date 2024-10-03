import { P, match } from 'ts-pattern';
import { ForbiddenError } from '../../../constants/errors';
import type { NonEmptyString } from '../../../types/non-empty-string';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { UserId } from '../../user/domain/user';
import type { User as UserDomain } from '../../user/domain/user';
import type { CreateTicketDto } from '../dto/create.ticket.dto';
import type { CreateTicketChat } from './create-ticket-chat';
import { Ticket } from './ticket';

export type CreateTicket = CreateTicket.User | CreateTicket.Operator;
export namespace CreateTicket {
	interface Base {
		subject: NonEmptyString;
		chat: CreateTicketChat.Base;
		status: Ticket.Status.SenderResponse;
		senderId: UserId;
	}

	export interface User extends Base {
		_tag: 'ByUser';
		taker: {
			_tag: 'Operator';
			topic: Ticket.Topic;
		};
		userAuth: UserAuth.User;
	}

	export interface Operator extends Base {
		_tag: 'ByOperator';
		taker: {
			_tag: 'User';
			userId: UserId;
		};
		assign: Set<UserId>;
	}

	export const mkUnsafe = ({
		dto,
		userAuth,
		users,
	}: {
		dto: CreateTicketDto;
		userAuth: UserAuth;
		users: UserDomain.Simple[] | undefined;
	}) => {
		const { content, subject } = dto;

		const base = {
			userAuth,
			subject,
			senderId: userAuth.id,
			chat: {
				content,
				userId: userAuth.id,
				_tag: 'BySender' as const,
			},
			status: Ticket.Status.Enum.SenderResponse,
		};

		return match([dto, userAuth])
			.with(
				[{ _tag: 'ByUser' }, { _tag: 'User' }],
				([dto, userAuth]): User => ({
					...base,
					_tag: 'ByUser',
					userAuth,
					taker: {
						_tag: 'Operator',
						topic: dto.topic,
					},
				}),
			)
			.with(
				[{ _tag: 'ByOperator' }, { _tag: 'Operator' }],
				([dto, userAuth]): Operator => {
					if (!users) throw new ForbiddenError('TicketMustAssignToUsers');
					const assign = new Set([...users.map((x) => x.id)]);
					return {
						...base,
						_tag: 'ByOperator',
						taker: {
							_tag: 'User',
							userId: dto.userId,
						},
						assign,
					};
				},
			)
			.with([{ _tag: P._ }, { _tag: P._ }], () => {
				throw new ForbiddenError('SufficientPermission');
			})
			.exhaustive();
	};
}
