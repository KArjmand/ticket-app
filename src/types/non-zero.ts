import { z } from 'zod';
import type { Brand } from './brand';

export type NonZero = Brand<number, 'NonZero'>;

export namespace NonZero {
	export const is = (n: number): n is NonZero => n !== 0;

	export const zod = z.number().refine(is, 'NonZero');
}
