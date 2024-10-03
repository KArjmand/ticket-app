import { z } from 'zod';
import type { UserId } from '../../../modules/user/domain/user';
import { IdMaker } from '../../../types/id-maker';
import type { NonEmptyString } from '../../../types/non-empty-string';
import type { TicketChat } from './chat';

export type Ticket = Ticket.ByUser | Ticket.ByOperator;
export type TicketId = Ticket.Id;
export namespace Ticket {
	export const Id = IdMaker.mk<'TicketId'>();
	export type Id = IdMaker.Infer<typeof Id>;

	interface Base {
		id: Id;
		subject: NonEmptyString;
		status: Status;
		createdAt: Date;
		updatedAt: Date;
		senderId: UserId;
		assign: Set<UserId>;
		seenBy: Set<UserId>;
	}

	export type Topic = (typeof Topic.all)[number];
	export namespace Topic {
		export const all = ['MyAccount'] as const;
		export const zod = z.enum(all);
		export const Enum = zod.enum;
	}

	export type ByUser = ByUser.T;
	export namespace ByUser {
		export interface T extends Base {
			_tag: 'ByUser';
			taker: {
				_tag: 'Operator';
				topic: Topic;
			};
		}

		export interface Open extends T {
			status: Status.Open;
		}

		export interface TakerResponse extends T {
			status: Status.TakerResponse;
		}

		export interface SenderResponse extends T {
			status: Status.SenderResponse;
		}

		export interface Close extends T {
			status: Status.Close;
		}
	}

	export type ByOperator = ByOperator.T;
	export namespace ByOperator {
		export interface T extends Base {
			_tag: 'ByOperator';
			taker: {
				_tag: 'User';
				userId: UserId;
			};
		}

		export interface Open extends T {
			status: Status.Open;
		}

		export interface TakerResponse extends T {
			status: Status.TakerResponse;
		}

		export interface SenderResponse extends T {
			status: Status.SenderResponse;
		}

		export interface Close extends T {
			status: Status.Close;
		}
	}

	export type Open = ByUser.Open | ByOperator.Open;

	export type TakerResponse = ByUser.TakerResponse | ByOperator.TakerResponse;

	export type SenderResponse =
		| ByUser.SenderResponse
		| ByOperator.SenderResponse;

	export type Close = ByUser.Close | ByOperator.Close;

	export type Status =
		| Status.Close
		| Status.TakerResponse
		| Status.SenderResponse
		| Status.Open;

	export namespace Status {
		export const all = [
			'Open',
			'Close',
			'SenderResponse',
			'TakerResponse',
		] as const;
		export const zod = z.enum(all);
		export const Enum = zod.enum;

		export type Open = 'Open';
		export type Close = 'Close';
		export type SenderResponse = 'SenderResponse';
		export type TakerResponse = 'TakerResponse';
	}

	export type NotClose = Open | TakerResponse | SenderResponse;
	export namespace NotClose {
		export const is = (ticket: Ticket): ticket is NotClose =>
			ticket.status !== 'Close';
	}

	export type NotOpen = Close | TakerResponse | SenderResponse;

	export namespace NotOpen {
		export const is = (ticket: Ticket): ticket is NotOpen =>
			ticket.status !== 'Open';
	}
}

export interface AllTicketChats {
	chats: TicketChat[];
	ticket: Ticket;
}
