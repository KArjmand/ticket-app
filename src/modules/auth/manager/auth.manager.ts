import AppDataSource from '../../../db/data-source';
import type { Email } from '../../../types/email';
import { UserEntity } from '../../user/manager/user.entity';
import { UserLogin } from '../domain/user-login';

export namespace AuthManager {
	const userRepository = AppDataSource.getRepository(UserEntity);

	export const findByEmail = async (email: Email) => {
		const user = await userRepository.findOne({
			where: { email },
			select: { id: true, password: true },
		});
		if (!user) return undefined;
		return UserLogin.WithPassword.zod.parse(user);
	};

	export const findLoggedInUser = async (userId: UserLogin.LoggedInId) => {
		const user = await userRepository.findOneOrFail({
			where: { id: userId },
		});
		return user.toLoggedInUser();
	};
}
