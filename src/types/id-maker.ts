import { z } from 'zod';
import type { Brand } from './brand';
import { UUID } from './uuid';

export namespace IdMaker {
	export const mk = <X extends string>() => {
		type Id = Brand<UUID, X>;
		const is = (id: string): id is Id => UUID.is(id);
		const zod = z.string().uuid().refine(is, 'IdMaker');

		const mk = (id: string) => (is(id) ? id : undefined);

		const mkUnsafe = (id: string): Id => id as Id;
		return { is, zod, mk, mkUnsafe };
	};

	export type Infer<A extends ReturnType<typeof mk>> = A extends {
		mkUnsafe: (id: string) => infer B;
	}
		? B
		: never;
}
