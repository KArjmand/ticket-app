import { z } from 'zod';
import type { Brand } from './brand';

export type Zero = Brand<number, 'Zero'>;
export namespace Zero {
	export const is = (n: number): n is Zero => n === 0;

	export const zod = z.number().refine(is, 'Zero');

	export const mk = (n: number) => (is(n) ? n : undefined);
}
