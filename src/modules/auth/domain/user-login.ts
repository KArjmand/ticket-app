import { z } from 'zod';
import type { Brand } from '../../../types/brand';
import type { NonEmptyString } from '../../../types/non-empty-string';
import { User } from '../../user/domain/user';
import type { AuthorizedUserId } from './authorized-user-id';
import { Password } from './password';

export type UserLogin = UserLogin.WithPassword;

export namespace UserLogin {
	const symbol = Symbol();
	export interface WithPassword {
		_tag: 'WithPassword';
		[symbol]: { id: User.Id; password?: Password };
	}

	export namespace WithPassword {
		export const zod = z
			.object({ id: User.Id.zod, password: Password.zod })
			.transform((x): WithPassword => ({ _tag: 'WithPassword', [symbol]: x }));
	}

	export type LoggedInId = Brand<AuthorizedUserId, 'LoggedInUserId'>;

	export namespace LoggedInId {
		export const mkWithPassword = async ({
			userLogin,
			enteredPassword,
		}: {
			userLogin: UserLogin.WithPassword;
			enteredPassword: NonEmptyString;
		}) => {
			if (
				userLogin[symbol].password &&
				(await Password.checkPassword(
					userLogin[symbol].password,
					enteredPassword,
				))
			) {
				return userLogin[symbol].id as LoggedInId;
			}
			return undefined;
		};
	}
}

export type LoggedInUser = Brand<
	User.Admin | User.User | User.Operator,
	'LoggedInUser'
>;
