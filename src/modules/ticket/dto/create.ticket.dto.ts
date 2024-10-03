import { z } from 'zod';
import { NonEmptyString } from '../../../types/non-empty-string';
import { User } from '../../user/domain/user';
import { Ticket } from '../domain/ticket';

export type CreateTicketDto = CreateTicketDto.CreateTicketDto;
export namespace CreateTicketDto {
	export type CreateTicketDto = z.TypeOf<typeof schema>;
	const base = z.object({
		subject: NonEmptyString.zod,
		content: NonEmptyString.zod,
		assign: z.array(User.Id.zod).nullable(),
	});
	const schema = z.discriminatedUnion('_tag', [
		base.extend({
			_tag: z.literal('ByUser'),
			topic: Ticket.Topic.zod,
		}),
		base.extend({
			_tag: z.literal('ByOperator'),
			userId: User.Id.zod,
		}),
	]);
	export const parse = (data: unknown): CreateTicketDto => schema.parse(data);
}
