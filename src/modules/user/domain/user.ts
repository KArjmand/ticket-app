import type { AccessLevel } from '../../../constants/access-level';
import type { Email } from '../../../types/email';
import { IdMaker } from '../../../types/id-maker';
import type { NonEmptyString } from '../../../types/non-empty-string';
import type { Password } from '../../auth/domain/password';

export type User = User.Admin | User.Operator | User.User;
export type UserId = User.Id;
export namespace User {
	export const Id = IdMaker.mk<'UserId'>();
	export type Id = IdMaker.Infer<typeof Id>;

	interface Base {
		id: Id;
		firstName: NonEmptyString;
		lastName: NonEmptyString;
		email: Email;
		password?: Password;
	}

	export interface User extends Base {
		accessLevel: AccessLevel.Enum['User'];
	}
	export interface Admin extends Base {
		accessLevel: AccessLevel.Enum['Admin'];
	}
	export interface Operator extends Base {
		accessLevel: AccessLevel.Enum['Operator'];
	}

	export type Simple = Simple.T;
	export namespace Simple {
		export interface T {
			id: Id;
			firstName?: string;
			lastName?: string;
		}
	}
}
