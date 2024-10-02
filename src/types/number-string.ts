import { z } from 'zod';
import type { Brand } from './brand';

export type NumberString = Brand<string, 'NumberString'>;

export namespace NumberString {
	export const is = (str: string): str is NumberString =>
		!!str.match(/^[0-9]+$/);

	export const mk = (str: string) => (is(str) ? str : undefined);

	export const zod = z.string().refine(is, 'NumberString');
}
