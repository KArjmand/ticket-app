import z from 'zod';
import { NonEmptyString } from '../../../types/non-empty-string';
import { Paginate } from '../../../types/paginate';

export type FindManyTicketDto = FindManyTicketDto.FindManyTicketDto;
export namespace FindManyTicketDto {
	const filter = z.object({
		subject: NonEmptyString.zod.nullable().optional(),
	});

	export type Filter = z.TypeOf<typeof filter>;

	export type FindManyTicketDto = z.TypeOf<typeof schema>;

	const schema = z.object({
		filter: filter.nullable().optional(),
		paginate: Paginate.zod,
	});

	export const parse = (data: unknown): FindManyTicketDto => schema.parse(data);
}
