import {
	type JwtPayload,
	sign as _sign,
	verify as _verify,
	decode,
} from 'jsonwebtoken';
import {
	ACCESS_TOKEN_EXPIRY,
	ACCESS_TOKEN_SECRET,
	AUDIENCE,
	ISSUER,
} from '../../../environments';
import type { Brand } from '../../../types/brand';
import { NonEmptyString } from '../../../types/non-empty-string';
import { UserAuth } from './user-auth';

export type AccessToken = Brand<NonEmptyString, 'AccessToken'>;
export type ValidAccessToken = Brand<AccessToken, 'Valid'>;

export class AccessTokenError extends Error {
	name = 'AccessTokenError';
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string) {
		super(message);
	}
}
export namespace AccessToken {
	export const is = (input: string): input is AccessToken =>
		NonEmptyString.is(input) && input.split('.').length === 3;

	export const mk = (raw: string) => (is(raw) ? raw : undefined);
	export const mkUnsafe = (raw: string) => {
		const at = mk(raw);
		if (!at) throw new AccessTokenError('Invalid AccessToken.');
		return at;
	};

	/**
	 * ⚠️ This function is not safe to use, it does not verify the token.
	 */
	export const extract = (accessToken: AccessToken) => {
		const str = decode(accessToken);
		const result = UserAuth.zod.safeParse(str);
		if (result.success) {
			return { id: result.data.id };
		}
	};

	export const sign = (userAuth: UserAuth): ValidAccessToken =>
		_sign(
			{
				...userAuth,
			},
			ACCESS_TOKEN_SECRET,
			{
				expiresIn: ACCESS_TOKEN_EXPIRY,
				issuer: ISSUER,
				subject: '',
				audience: AUDIENCE,
				algorithm: 'HS256',
			},
		) as ValidAccessToken;

	export const verify = (accessToken: AccessToken) => {
		const user = _verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;
		return UserAuth.zod.parse(user);
	};
}
