import { match } from 'ts-pattern';
import type { SelectQueryBuilder } from 'typeorm';
import AppDataSource from '../../../db/data-source';
import { PaginationResult } from '../../../types/paginate';
import { WholeNumber } from '../../../types/whole-number';
import type { UserId } from '../../user/domain/user';
import type { AuthorizeToViewTicket } from '../domain/authorize-to-view-all-ticket';
import type { CloseTicket } from '../domain/close-ticket';
import type { CreateTicket } from '../domain/create-ticket';
import type { CreateTicketChat } from '../domain/create-ticket-chat';
import type { OpenTicket } from '../domain/open-ticket';
import { type AllTicketChats, Ticket, type TicketId } from '../domain/ticket';
import type { FindManyTicketDto } from '../dto/find-many-ticket.dto';
import { TicketEntity } from './ticket.entity';

export namespace TicketManager {
	const ticketRepository = AppDataSource.getRepository(TicketEntity);

	const _findById = (id: TicketId) =>
		ticketRepository
			.findOneByOrFail({ id })
			.then((ticket) => ticket.toTicket());

	const prepareCondition = ({
		data,
		query,
	}: {
		data: AuthorizeToViewTicket;
		query: SelectQueryBuilder<TicketEntity>;
	}) =>
		match(data)
			.with(
				{ _tag: 'Assigned' },
				({ userAuth }) =>
					query.andWhere(
						`"T"."assign" ? '${userAuth.id}' OR "T"."assign" = '[]'`,
					), // means array contains userAuth.id
			)
			.with({ _tag: 'AllTicket' }, () => query)
			.with({ _tag: 'User' }, ({ userAuth }) =>
				query.andWhere(
					`(("T"."_tag" = 'ByUser' AND "T"."senderId" = '${userAuth.id}') OR ("T"."_tag" = 'ByOperator' AND "T"."takerUserid" = '${userAuth.id}'))`,
				),
			)
			.exhaustive();

	export const findOne = async ({
		id,
		data,
	}: {
		id: Ticket.Id;
		data: AuthorizeToViewTicket;
	}) => {
		const query = ticketRepository.createQueryBuilder('T').where({ id });
		const findQuery = prepareCondition({ data, query });
		return findQuery.getOneOrFail().then((x) => x.toTicket());
	};
	export const create = async (data: CreateTicket) => {
		const taker =
			data.taker._tag === 'User'
				? {
						_tag: data.taker._tag,
						userId: data.taker.userId,
					}
				: {
						_tag: data.taker._tag,
						topic: data.taker.topic,
					};
		const assign = data._tag === 'ByOperator' ? [...data.assign] : [];
		const chats = data.chat;
		const toSave = ticketRepository.create({
			...data,
			chats: [{ ...chats }],
			taker,
			assign,
		});
		const saved = await ticketRepository.save(toSave);
		return _findById(Ticket.Id.zod.parse(saved.id));
	};

	export const update = ({
		ids,
		ticket,
	}: {
		ids: Set<UserId>;
		ticket: Ticket.NotClose;
	}) => {
		ticketRepository.save({ id: ticket.id, assign: [...ids] });
	};

	export const close = async (data: CloseTicket) => {
		await ticketRepository.update(
			{ id: data.ticket.id },
			{ status: Ticket.Status.Enum.Close },
		);
		return _findById(data.ticket.id);
	};

	export const open = async (data: OpenTicket) => {
		await ticketRepository.update(
			{ id: data.ticket.id },
			{ status: Ticket.Status.Enum.Open },
		);
		return _findById(data.ticket.id);
	};

	export const changStatusTicket = async (data: CreateTicketChat) => {
		await ticketRepository.save({
			id: data.ticket.id,
			status: data.status,
		});
	};

	export const updateSeenBy = ({
		data,
		seenBy,
	}: {
		data: AllTicketChats;
		seenBy: Set<UserId>;
	}) => {
		ticketRepository.save({ id: data.ticket.id, seenBy: [...seenBy] });
	};

	export const findAndPaginate = async ({
		data,
		dto,
	}: {
		data: AuthorizeToViewTicket;
		dto: FindManyTicketDto;
	}) => {
		const { paginate, filter } = dto;
		const query = ticketRepository.createQueryBuilder('T').where({});

		const findQuery = prepareCondition({ data, query });

		if (filter?.subject)
			findQuery.andWhere(`"T"."subject" ilike '%${filter.subject}%'`);

		const [items, count] = await findQuery
			.take(paginate.take)
			.skip(paginate.skip)
			.getManyAndCount();

		return PaginationResult.mk({
			items: items.map((ticket) => ticket.toTicket()),
			count: WholeNumber.mkUnsafe(count || 0),
			paginate,
		});
	};
}
