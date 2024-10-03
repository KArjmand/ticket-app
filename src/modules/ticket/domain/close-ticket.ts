import { match } from 'ts-pattern';
import { ForbiddenError } from '../../../constants/errors';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { Ticket } from './ticket';

export type CloseTicket = CloseTicket.ByUser | CloseTicket.ByOperator;
export namespace CloseTicket {
	export interface ByUser {
		ticket: Ticket.NotClose;
		evidence: { userAuth: UserAuth.User };
	}
	export interface ByOperator {
		ticket: Ticket.NotClose;
		evidence: { userAuth: UserAuth.Operator };
	}

	export const mkUnsafe = ({
		ticket,
		userAuth,
	}: {
		ticket: Ticket.NotClose;
		userAuth: UserAuth;
	}) =>
		match(userAuth)
			.with(
				{ _tag: 'User' },
				(userAuth): ByUser => ({
					ticket,
					evidence: { userAuth: userAuth },
				}),
			)
			.with(
				{ _tag: 'Operator' },
				(userAuth): ByOperator => ({
					ticket,
					evidence: { userAuth: userAuth },
				}),
			)
			.with({ _tag: 'Admin' }, () => {
				throw new ForbiddenError('YouShallNotPass');
			})
			.exhaustive();
}
