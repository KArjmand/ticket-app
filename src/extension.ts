import type { UserAuth } from './modules/auth/domain/user-auth';

declare global {
	namespace Express {
		interface Request {
			userAuth?: UserAuth;
		}
	}
}
