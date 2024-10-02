import { z } from 'zod';
import type { Brand } from './brand';

export type NonEmptyString = Brand<string, 'NonEmptyString'>;

export class NonEmptyStringError extends Error {
	name = 'NonEmptyStringError';
}

export namespace NonEmptyString {
	export const is = (str: string): str is NonEmptyString =>
		str.trim().length > 0;
	export const zod = z.string().refine(is, 'NonEmptyString');

	export const mk = (str: string): NonEmptyString | undefined =>
		is(str) ? str : undefined;

	export const mkUnsafe = (str: string): NonEmptyString => {
		const result = mk(str);
		if (!result) throw new NonEmptyStringError('should be non empty string.');
		return result;
	};

	export const replace = (
		str: NonEmptyString,
		searchValue: string | RegExp,
		replaceValue: NonEmptyString,
	) => str.replace(searchValue, replaceValue) as NonEmptyString;
}
