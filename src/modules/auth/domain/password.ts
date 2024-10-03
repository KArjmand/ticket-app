import { NonEmptyString } from '../../../types/non-empty-string';
import { comparePassword } from '../../../utils/password';

export type Password = Password.Password;

export namespace Password {
	const symbol = Symbol('Password');

	export interface Password {
		[symbol]: string;
	}

	export const checkPassword = (password: Password, check: NonEmptyString) => {
		return comparePassword(check, password[symbol]);
	};

	const mk = (str: NonEmptyString): Password => ({ [symbol]: str });

	export const zod = NonEmptyString.zod.transform(mk);
}
