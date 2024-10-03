import { z } from 'zod';
import { GraterEqThanZero } from './grater-eq-than-zero';
import { Int } from './int';

// Positive Integer
// https://www.cuemath.com/numbers/whole-numbers/
// adad hesabi
export type WholeNumber = Int & GraterEqThanZero;

export namespace WholeNumber {
	export const is = (num: number): num is WholeNumber =>
		Int.is(num) && GraterEqThanZero.is(num);

	export const zod = z.number().refine(is, 'WholeNumber');

	export const mk = (num: number) => (is(num) ? num : undefined);
	export const mkUnsafe = (num: number) => {
		const n = mk(num);
		if (n === undefined) throw new Error('Should whole number');
		return n;
	};
}
