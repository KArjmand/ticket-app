import { z } from 'zod';
import type { Brand } from './brand';

export type Email = Brand<string, 'Email'>;

export class EmailError extends Error {
	name = 'EmailError';
	constructor(message: string) {
		super(message);
	}
}

export namespace Email {
	export const is = (str: string): str is Email =>
		z.string().email().safeParse(str).success;

	export const zod = z.string().refine(is, 'Email');

	export const mk = (email: string): Email | undefined =>
		is(email) ? email : undefined;

	export const makeUnsafe = (str: string): Email => {
		const email = mk(str);
		if (email === undefined) throw new EmailError('Invalid email.');
		return email;
	};
}
