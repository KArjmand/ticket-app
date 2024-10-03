import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { z } from 'zod';
import { AccessLevel } from '../../../constants/access-level';
import { Email } from '../../../types/email';
import { NonEmptyString } from '../../../types/non-empty-string';
import type { LoggedInUser } from '../../auth/domain/user-login';
import { User } from '../domain/user';

@Entity({
	name: 'users',
})
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({ type: 'varchar' })
	accessLevel: string;

	@Column({ nullable: true })
	password: string;

	toLoggedInUser() {
		const base = z.object({
			id: User.Id.zod.brand<'AuthorizedUserId'>(),
			firstName: NonEmptyString.zod,
			lastName: NonEmptyString.zod,
			email: Email.zod,
			accessLevel: AccessLevel.zod,
		});
		return z
			.discriminatedUnion('accessLevel', [
				base.extend({
					accessLevel: z.literal('Admin'),
				}),
				base.extend({
					accessLevel: z.literal('User'),
				}),
				base.extend({
					accessLevel: z.literal('Operator'),
				}),
			])
			.brand<'LoggedInUser'>()

			.transform((user): LoggedInUser => user)
			.parse(this);
	}

	ToSimple() {
		const simple = z
			.object({
				id: User.Id.zod.brand<'AuthorizedUserId'>(),
				firstName: z.string(),
				lastName: z.string(),
			})
			.transform((u): User.Simple => u)
			.parse(this);
		return simple;
	}
}
