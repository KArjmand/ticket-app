import type { UserAuth } from '../../auth/domain/user-auth';
import type { UserId } from '../domain/user';
import { UserManager } from '../manager/user.manager';

export namespace UserService {
	export const findUserSimpleByIds = async ({
		ids,
		userAuth,
	}: {
		ids: Set<UserId>;
		userAuth: UserAuth.Operator;
	}) => {
		return UserManager.findUserSimpleByIds({ ids, userAuth });
	};
}
