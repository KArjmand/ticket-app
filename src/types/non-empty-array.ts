import z, { type ZodTypeAny } from 'zod';

export type NonEmptyArray<T> = [T, ...T[]];

export class NonEmptyArrayError extends Error {
	name = 'NonEmptyArrayError';
}

export namespace NonEmptyArray {
	export const is = <T>(arr: T[]): arr is NonEmptyArray<T> => arr.length > 0;

	export const zod = <T extends ZodTypeAny>(value: T) =>
		z.array(value).nonempty();

	export const mk = <T>(array: T[]): NonEmptyArray<T> | undefined =>
		is(array) ? array : undefined;

	export const mkUnSafe = <T>(array: T[]): NonEmptyArray<T> => {
		const list = mk(array);

		if (list === undefined)
			throw new NonEmptyArrayError('Should not be empty array');
		return list;
	};

	export const head = <T>([t]: NonEmptyArray<T>) => t;

	export const map = <T, A>(
		[t, ...as]: NonEmptyArray<T>,
		fn: (t: T) => A,
	): NonEmptyArray<A> => [fn(t), ...as.map(fn)];

	export function isNonEmptyArray<A>(
		obj: Array<A> | undefined,
	): obj is NonEmptyArray<A> {
		return obj !== undefined && NonEmptyArray.is(obj);
	}

	export const groupBy = <A, K extends string>(
		arr: NonEmptyArray<A>,
		f: (a: A) => K,
	): Partial<Record<K, NonEmptyArray<A>>> => {
		const out: Partial<Record<K, NonEmptyArray<A>>> = {};
		for (const a of arr) {
			const k = f(a);
			if (Object.prototype.hasOwnProperty.call(out, k)) {
				out[k]?.push(a);
			} else {
				out[k] = [a];
			}
		}
		return out;
	};
}
