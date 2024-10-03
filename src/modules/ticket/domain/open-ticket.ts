import { match } from 'ts-pattern';
import { ForbiddenError } from '../../../constants/errors';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { Ticket } from './ticket';

export type OpenTicket = OpenTicket.ByUser | OpenTicket.ByOperator;
export namespace OpenTicket {
	export interface ByUser {
		ticket: Ticket.NotOpen;
		evidence: { userAuth: UserAuth.User };
	}
	export interface ByOperator {
		ticket: Ticket.NotOpen;
		evidence: {
			userAuth: UserAuth.Operator;
		};
	}

	export const mkUnsafe = ({
		ticket,
		userAuth,
	}: {
		ticket: Ticket.NotOpen;
		userAuth: UserAuth;
	}) =>
		match(userAuth)
			.with(
				{ _tag: 'User' },
				(userAuth): ByUser => ({
					ticket,
					evidence: {
						userAuth,
					},
				}),
			)
			.with(
				{ _tag: 'Operator' },
				(userAuth): ByOperator => ({
					ticket,
					evidence: {
						userAuth: userAuth,
					},
				}),
			)
			.with({ _tag: 'Admin' }, () => {
				throw new ForbiddenError('');
			})
			.exhaustive();
}
