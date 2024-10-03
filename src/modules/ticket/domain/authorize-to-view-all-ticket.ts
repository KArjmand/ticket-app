import { match } from 'ts-pattern';
import type { UserAuth } from '../../auth/domain/user-auth';

export type AuthorizeToViewTicket =
	| AuthorizeToViewTicket.Assigned
	| AuthorizeToViewTicket.User
	| AuthorizeToViewTicket.AllTicket;

export namespace AuthorizeToViewTicket {
	export interface User {
		_tag: 'User';
		userAuth: UserAuth.User;
		accessibleTicket: {
			_tag: 'ByUser';
		};
	}

	export interface Assigned {
		_tag: 'Assigned';
		userAuth: UserAuth.Operator;
		accessibleTicket: {
			_tag: 'ByUser';
		};
	}

	export interface AllTicket {
		_tag: 'AllTicket';
		userAuth: UserAuth.Operator | UserAuth.Admin;
	}

	export const mkUnsafe = (userAuth: UserAuth): AuthorizeToViewTicket =>
		match(userAuth)
			.with(
				{ _tag: 'User' },
				(userAuth): User => ({
					userAuth,
					_tag: 'User',
					accessibleTicket: {
						_tag: 'ByUser',
					},
				}),
			)
			.with({ _tag: 'Operator' }, (userAuth): Assigned => {
				const result: Assigned = {
					_tag: 'Assigned',
					userAuth,
					accessibleTicket: {
						_tag: 'ByUser',
					},
				};
				return result;
			})
			.with({ _tag: 'Admin' }, (userAuth) => ({
				_tag: 'AllTicket' as const,
				userAuth,
			}))
			.exhaustive();
}
