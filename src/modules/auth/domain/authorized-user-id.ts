import type { Brand } from '../../../types/brand';
import type { User } from '../../user/domain/user';
import type { UserAuth } from './user-auth';

export type AuthorizedUserId = Brand<User.Id, 'AuthorizedUserId'>;

export namespace AuthorizedUserId {
	export const is =
		(user: UserAuth) =>
		(userId: User.Id): userId is AuthorizedUserId =>
			userId === user.id;
}
