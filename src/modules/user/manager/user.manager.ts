import { In } from 'typeorm';
import AppDataSource from '../../../db/data-source';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { User, UserId } from '../domain/user';
import { UserEntity } from './user.entity';

export namespace UserManager {
	const userRepository = AppDataSource.getRepository(UserEntity);

	export const findUserSimpleByIds = async ({
		ids,
		userAuth,
	}: {
		ids: Set<UserId>;
		userAuth: UserAuth.Operator;
	}): Promise<User.Simple[] | undefined> => {
		const users = await userRepository.find({
			where: { id: In([...ids]) },
		});
		if (!users) return undefined;
		return users.map((u) => u.ToSimple());
	};
}
