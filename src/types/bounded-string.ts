import type { Brand } from './brand';
import { NonEmptyString } from './non-empty-string';

export type BoundedString<
	MinLength extends number,
	MaxLength extends number,
> = Brand<NonEmptyString, 'BoundedString'> & {
	minLength: MinLength;
	maxLength: MaxLength;
};

export namespace BoundedString {
	export const is =
		<MinLength extends number, MaxLength extends number>(
			minLength: MinLength,
			maxLength: MaxLength,
		) =>
		(str: string): str is BoundedString<MinLength, MaxLength> => {
			return str.length >= minLength && str.length <= maxLength;
		};

	export const mkUnsafe = <MinLength extends number, MaxLength extends number>(
		str: string,
		minLength: MinLength,
		maxLength: MaxLength,
	): BoundedString<MinLength, MaxLength> => {
		if (is(minLength, maxLength)(str)) {
			return str;
		}
		throw new Error('should be non empty string');
	};

	export const zod = <MinLength extends number, MaxLength extends number>(
		minLength: MinLength,
		maxLength: MaxLength,
	) => NonEmptyString.zod.refine(is(minLength, maxLength), `BoundedString`);
}
