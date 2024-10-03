import { z } from 'zod';
import { NonZero } from './non-zero';
import { WholeNumber } from './whole-number';

// Non Zero Positive Int
// https://en.wikipedia.org/wiki/Natural_number
// adad tabiee
export type NaturalNumber = WholeNumber & NonZero;

export namespace NaturalNumber {
	export const is = (num: number) => WholeNumber.is(num) && NonZero.is(num);

	export const zod = z.number().refine(is, 'NaturalNumber');

	export const mk = (num: number) => (is(num) ? num : undefined);
	export const mkUnsafe = (num: number) => {
		const n = mk(num);
		if (!n) throw new Error('Should natural number');
		return n;
	};
}
