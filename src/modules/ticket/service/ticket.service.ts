import { ForbiddenError } from '../../../constants/errors';
import type { UserAuth } from '../../auth/domain/user-auth';
import type { UserId } from '../../user/domain/user';
import { UserService } from '../../user/service/user.service';
import { AuthorizeToViewTicket } from '../domain/authorize-to-view-all-ticket';
import { CloseTicket } from '../domain/close-ticket';
import { CreateTicket } from '../domain/create-ticket';
import { OpenTicket } from '../domain/open-ticket';
import { type AllTicketChats, Ticket } from '../domain/ticket';
import type { CreateTicketDto } from '../dto/create.ticket.dto';
import type { FindManyTicketDto } from '../dto/find-many-ticket.dto';
import { TicketManager } from '../manager/ticket.manager';

export namespace TicketService {
	export const create = async ({
		dto,
		userAuth,
	}: {
		dto: CreateTicketDto;
		userAuth: UserAuth;
	}) => {
		const users =
			dto.assign && userAuth._tag === 'Operator'
				? await UserService.findUserSimpleByIds({
						ids: new Set([...dto.assign]),
						userAuth,
					})
				: undefined;

		const data = CreateTicket.mkUnsafe({ dto, userAuth, users });
		return TicketManager.create(data);
	};

	export const close = async ({
		id,
		userAuth,
	}: {
		id: Ticket.Id;
		userAuth: UserAuth;
	}) => {
		const ticket = await findOne({
			id,
			userAuth,
		});

		if (!Ticket.NotClose.is(ticket))
			throw new ForbiddenError('TicketAlreadyClose');

		const data = CloseTicket.mkUnsafe({ ticket, userAuth });
		return TicketManager.close(data);
	};

	export const findOne = async ({
		id,
		userAuth,
	}: {
		id: Ticket.Id;
		userAuth: UserAuth;
	}) => {
		return TicketManager.findOne({
			id,
			data: AuthorizeToViewTicket.mkUnsafe(userAuth),
		});
	};

	export const seen = ({
		data,
		userAuth,
	}: {
		data: AllTicketChats;
		userAuth: UserAuth;
	}) => {
		const seenBy = new Set([...data.ticket.seenBy, userAuth.id]);
		TicketManager.updateSeenBy({ data, seenBy });
	};

	export const update = async ({
		id,
		userAuth,
		assign,
	}: {
		id: Ticket.Id;
		userAuth: UserAuth.Operator;
		assign: Set<UserId>;
	}) => {
		const ticket = await findOne({ id, userAuth });
		if (!Ticket.NotClose.is(ticket))
			throw new ForbiddenError('TicketAlreadyClose');

		const users = await UserService.findUserSimpleByIds({
			ids: assign,
			userAuth,
		});

		if (!users) throw new ForbiddenError('TicketMustAssignToUsers');

		const ids = new Set(users.map((x) => x.id));

		return TicketManager.update({ ids, ticket });
	};

	export const open = async ({
		id,
		userAuth,
	}: {
		id: Ticket.Id;
		userAuth: UserAuth;
	}) => {
		const ticket = await findOne({ id, userAuth });

		if (!Ticket.NotOpen.is(ticket))
			throw new ForbiddenError('TicketAlreadyClose');

		const data = OpenTicket.mkUnsafe({ ticket, userAuth });
		return TicketManager.open(data);
	};

	export const findAndPaginate = ({
		dto,
		userAuth,
	}: {
		dto: FindManyTicketDto;
		userAuth: UserAuth;
	}) => {
		const data = AuthorizeToViewTicket.mkUnsafe(userAuth);
		return TicketManager.findAndPaginate({ data, dto });
	};
}
