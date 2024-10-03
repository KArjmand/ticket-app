import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { z } from 'zod';
import { NonEmptyString } from '../../../types/non-empty-string';
import { User } from '../../user/domain/user';
import { UserEntity } from '../../user/manager/user.entity';
import { Ticket } from '../domain/ticket';
import { TicketChatEntity } from './ticket-chat.entity';

const TABLE_NAME = 'tickets';

class TakerEmbedded {
	@Column()
	_tag: 'User' | 'Operator';

	@ManyToOne(() => UserEntity, { nullable: true })
	user: User;

	@Column({ nullable: true })
	userId?: User.Id;

	@Column({ nullable: true })
	topic?: Ticket.Topic;
}

@Entity({
	name: TABLE_NAME,
	orderBy: {
		createdAt: 'DESC',
	},
})
export class TicketEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	_tag: 'ByUser' | 'ByOperator';

	@ManyToOne(() => UserEntity)
	sender: unknown;

	@Column()
	senderId: string;

	@Column()
	subject: string;

	@Column()
	status: 'Close' | 'TakerResponse' | 'SenderResponse' | 'Open';

	@Column(() => TakerEmbedded)
	taker: TakerEmbedded;

	@OneToMany(
		() => TicketChatEntity,
		(ch) => ch.ticket,
		{
			cascade: ['insert', 'update'],
		},
	)
	chats: TicketChatEntity[];

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@Column({ type: 'jsonb', default: '[]' })
	assign: Array<string>;

	@Column({ type: 'jsonb', default: '[]' })
	seenBy: Array<string>;

	private static get schema() {
		const base = z.object({
			id: Ticket.Id.zod,
			subject: NonEmptyString.zod,
			status: Ticket.Status.zod,
			createdAt: z.date(),
			updatedAt: z.date(),
			senderId: User.Id.zod,
			assign: z
				.array(User.Id.zod)
				.transform((ids) => new Set(ids))
				.default([]),
			seenBy: z
				.array(User.Id.zod)
				.transform((ids) => new Set(ids))
				.default([]),
		});

		const user = base.extend({
			taker: z.object({
				_tag: z.literal('Operator'),
				topic: Ticket.Topic.zod,
			}),
		});

		const operator = base.extend({
			taker: z.object({
				_tag: z.literal('User'),
				userId: User.Id.zod,
			}),
		});

		return z
			.discriminatedUnion('_tag', [
				user.extend({
					_tag: z.literal('ByUser'),
				}),
				operator.extend({
					_tag: z.literal('ByOperator'),
				}),
			])
			.transform((ticket): Ticket => ticket);
	}
	toTicket() {
		return TicketEntity.schema.parse(this);
	}
}
