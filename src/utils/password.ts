import { compare, hash, hashSync } from 'bcryptjs';
import { BCRYPT_SALT } from '../environments';
import { NonEmptyString } from '../types/non-empty-string';

/**
 * Returns hashed password by hash password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @returns The hashed password mean of `password`
 *
 * @beta
 */
export const hashPassword = async (password: string): Promise<string> => {
	return await hash(password, BCRYPT_SALT);
};

export const hashSyncPassword = (password: string): NonEmptyString => {
	return NonEmptyString.mkUnsafe(hashSync(password, BCRYPT_SALT));
};

/**
 * Returns boolean by compare password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @param hash - The second input number
 * @returns The boolean mean of `password` and `hash`
 *
 * @beta
 */
export const comparePassword = async (
	password: string,
	hash: string,
): Promise<boolean> => {
	return await compare(password, hash);
};
