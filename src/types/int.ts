import { z } from 'zod';
import type { Brand } from './brand';

export type Int = Brand<number, 'Integer'>;

export namespace Int {
	export const is = (x: number): x is Int => Number.isInteger(x);

	export const zod = z.number().refine(is, 'Int');
}
