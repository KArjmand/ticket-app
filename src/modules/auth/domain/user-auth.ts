import { match } from 'ts-pattern';
import { z } from 'zod';
import type { Brand } from '../../../types/brand';
import { NonEmptyString } from '../../../types/non-empty-string';
import { User } from '../../user/domain/user';
import type { LoggedInUser } from './user-login';

export type UserAuth = UserAuth.Admin | UserAuth.User | UserAuth.Operator;
export namespace UserAuth {
	interface Base {
		id: User.Id;
		firstName: NonEmptyString;
		lastName: NonEmptyString;
	}

	export interface Admin extends Base {
		_tag: 'Admin';
	}
	export const isAdmin = (user: UserAuth): user is Operator =>
		user._tag === 'Admin';

	export interface User extends Base {
		_tag: 'User';
	}
	export const isUser = (user: UserAuth): user is Operator =>
		user._tag === 'User';

	export interface Operator extends Base {
		_tag: 'Operator';
	}

	export const isOperator = (user: UserAuth): user is Operator =>
		user._tag === 'Operator';

	export const mk = (user: LoggedInUser) => {
		return match<LoggedInUser, UserAuth>(user)
			.with({ accessLevel: 'Admin' }, ({ firstName, lastName, id }) => ({
				_tag: 'Admin',
				...user,
			}))
			.with({ accessLevel: 'User' }, (user) => ({ _tag: 'User', ...user }))
			.with({ accessLevel: 'Operator' }, (user) => ({
				_tag: 'Operator',
				...user,
			}))
			.exhaustive();
	};

	export type Me = Brand<UserAuth, 'Me'>;
	export namespace Me {
		export const is = (id: User.Id, userAuth: UserAuth): userAuth is Me =>
			id === userAuth.id;
	}

	const base = z.object({
		id: User.Id.zod,
		firstName: NonEmptyString.zod,
		lastName: NonEmptyString.zod,
	});

	export const zod = z
		.discriminatedUnion('_tag', [
			base.extend({
				_tag: z.literal('Admin'),
			}),
			base.extend({
				_tag: z.literal('User'),
			}),
			base.extend({
				_tag: z.literal('Operator'),
			}),
		])
		.transform((x): UserAuth => ({ ...x }));
}
