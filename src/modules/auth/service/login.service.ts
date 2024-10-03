import { ForbiddenError } from '../../../constants/errors';
import type { NonEmptyString } from '../../../types/non-empty-string';
import { AccessToken } from '../domain/access-token';
import { UserAuth } from '../domain/user-auth';
import { UserLogin } from '../domain/user-login';
import type { LoginWithEmailDto } from '../dto/login-with-email.dto';
import { AuthManager } from '../manager/auth.manager';

export namespace LoginService {
	const loginWithPassword = async ({
		userLogin,
		password,
	}: {
		userLogin: UserLogin.WithPassword;
		password: NonEmptyString;
	}) => {
		const loggedInUserId = await UserLogin.LoggedInId.mkWithPassword({
			userLogin,
			enteredPassword: password,
		});
		if (!loggedInUserId) throw new ForbiddenError('MismatchPasswordOrUsername');
		return await login({ userId: loggedInUserId });
	};

	const login = async ({ userId }: { userId: UserLogin.LoggedInId }) => {
		const loggedInUser = await AuthManager.findLoggedInUser(userId);

		const userAuth = UserAuth.mk(loggedInUser);

		const accessToken = AccessToken.sign(userAuth);

		return {
			accessToken,
		};
	};

	// login with email
	export const loginWithEmail = async ({
		password,
		email,
	}: LoginWithEmailDto) => {
		const userLogin = await AuthManager.findByEmail(email);
		if (!userLogin) throw new ForbiddenError('MismatchPasswordOrUsername');

		return await loginWithPassword({
			userLogin,
			password,
		});
	};
}
