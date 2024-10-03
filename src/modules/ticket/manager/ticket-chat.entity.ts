import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { z } from 'zod';
import { NonEmptyString } from '../../../types/non-empty-string';
import { User } from '../../user/domain/user';
import { UserEntity } from '../../user/manager/user.entity';
import { TicketChat } from '../domain/chat';
import { Ticket } from '../domain/ticket';
import { TicketEntity } from './ticket.entity';

const TABLE_NAME = 'ticket_chats';
@Entity({
	name: TABLE_NAME,
	orderBy: {
		createdAt: 'DESC',
	},
})
export class TicketChatEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => TicketEntity)
	ticket: TicketEntity;

	@Column()
	_tag: 'ByTaker' | 'BySender';

	@Column()
	ticketId: string;

	@ManyToOne(() => UserEntity)
	user: unknown;

	@Column()
	userId: string;

	@Column()
	content: string;

	@CreateDateColumn({
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt!: Date;

	static get Schema() {
		const base = z.object({
			id: TicketChat.Id.zod,
			ticketId: Ticket.Id.zod,
			userId: User.Id.zod,
			content: NonEmptyString.zod,
			createdAt: z.date(),
		});

		const schema = z.discriminatedUnion('_tag', [
			base.extend({ _tag: z.literal('ByTaker') }),
			base.extend({ _tag: z.literal('BySender') }),
		]);
		return { schema };
	}

	toChat(): TicketChat {
		const { id, content, createdAt, ticketId, userId, _tag } = this;
		const raw = {
			_tag,
			id,
			content,
			createdAt,
			ticketId,
			userId,
		};
		return TicketChatEntity.Schema.schema
			.transform((chat): TicketChat => chat)
			.parse(raw);
	}
}
