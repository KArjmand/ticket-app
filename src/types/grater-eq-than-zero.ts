import { z } from 'zod';
import type { Brand } from './brand';

export type GraterEqThanZero = Brand<number, 'GraterEqThanZero'>;
export namespace GraterEqThanZero {
	export const is = (n: number): n is GraterEqThanZero => n >= 0;

	export const zod = z.number().refine(is, 'GraterEqThanZero');

	export const mk = (n: number) => (is(n) ? n : undefined);
}
