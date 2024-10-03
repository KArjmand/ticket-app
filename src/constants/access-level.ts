import { z } from 'zod';

export type AccessLevel = (typeof AccessLevel.allKeys)[number];

export namespace AccessLevel {
	export const allKeys = ['Admin', 'User', 'Operator'] as const;

	export const zod = z.enum(allKeys);

	export type Enum = typeof zod.Enum;

	export const Enum = zod.enum;

	export const is = (str: string): str is AccessLevel =>
		allKeys.some((x) => x === str);
}
