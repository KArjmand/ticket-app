import { z } from 'zod';
import { NaturalNumber } from './natural-number';
import type { WholeNumber } from './whole-number';

export type Paginate = Paginate.T;
export namespace Paginate {
	/*
    sometimes we don't need a paginate just and empty object
    (because in typeorm we want to spread an empty object when we don't want to limit or offset)
    but when we say that the type is {}
    when we want to use the type we should narrow down the type to object that have take or skip
    we should also use Record<string, never> for empty objects but when we do that typescript will infer
    that always there is take and skip but we know that sometimes both of them is empty and undefined,
    so we use this hack that take and skip is optional and undefined so when we say that we check that take is defined
    then  typescript knows that we are talking about the object that have take and skip

  */
	// export namespace PaginateDTO {

	// }
	export type T =
		| { take?: undefined; skip?: undefined }
		| {
				take: NaturalNumber;
				skip: WholeNumber;
		  };
	const base = z.object({
		limit: z.coerce
			.number(NaturalNumber.zod)
			.refine(NaturalNumber.is)
			.optional(),
		page: z.coerce
			.number(NaturalNumber.zod)
			.refine(NaturalNumber.is)
			.default(1),
	});
	export const zod = base.transform((x): T => Paginate.mk(x));

	export const mk = (
		pagination: z.TypeOf<typeof base>,
		defaultLimit?: NaturalNumber,
	): T => {
		const take = pagination.limit || defaultLimit;

		if (take === undefined) return {};

		const skip = ((pagination.page - 1) * take) as WholeNumber;
		return { take, skip };
	};
}

export type PaginationResult<A> = PaginationResult.PaginationResult<A>;

export namespace PaginationResult {
	export interface PaginationResult<A> {
		items: A[];
		meta: {
			/**
			 * the amount of items on this specific page
			 */
			itemCount: WholeNumber;
			/**
			 * the total amount of items
			 */
			totalItems: WholeNumber;
			/**
			 * the amount of items that were requested per page
			 */
			itemsPerPage: NaturalNumber;
			/**
			 * the total amount of pages in this paginator
			 */
			totalPages: WholeNumber;
			/**
			 * the current page this paginator "points" to
			 */
			currentPage: NaturalNumber;
		};
	}

	export const mk = <A>({
		items,
		count,
		paginate,
	}: {
		items: A[];
		count: WholeNumber;
		paginate: Paginate;
	}): PaginationResult<A> => {
		return {
			items,
			meta: {
				totalItems: count,
				itemCount: items.length as WholeNumber,
				totalPages: (paginate?.take !== undefined
					? Math.ceil(count / paginate.take)
					: 1) as WholeNumber,
				currentPage: (paginate?.take !== undefined
					? paginate.skip / paginate.take + 1
					: 1) as NaturalNumber,
				itemsPerPage: (paginate?.take || items.length) as NaturalNumber,
			},
		};
	};
}
