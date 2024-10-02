import { v4 } from 'uuid';
import { z } from 'zod';
import type { Brand } from './brand';

export type UUID = Brand<string, 'UUID'>;

export namespace UUID {
	export const is = (str: string): str is UUID =>
		z.string().uuid().safeParse(str).success;

	export const zod = z.string().refine(is, 'UUID');

	export const generate = () => v4() as UUID;
}
