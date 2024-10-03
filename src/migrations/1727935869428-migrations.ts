import { hashSyncPassword } from '../utils/password';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1727935869428 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const users = [
			{
				accessLevel: 'Admin',
				email: 'admin@bstco.ir',
				firstName: 'Admin',
				lastName: 'Admin',
				password: hashSyncPassword('12345678'),
			},
			{
				accessLevel: 'User',
				email: 'user@bstco.ir',
				firstName: 'User',
				lastName: 'User',
				password: hashSyncPassword('12345678'),
			},
			{
				accessLevel: 'Operator',
				email: 'operator@bstco.ir',
				firstName: 'Operator',
				lastName: 'Operator',
				password: hashSyncPassword('12345678'),
			},
		];
		const query = users
			.map(
				(u) =>
					`('${u.accessLevel}','${u.email}','${u.firstName}','${u.lastName}','${u.password}')`,
			)
			.join(',');
		await queryRunner.query(
			`INSERT INTO "public"."users" ("accessLevel", "email", "firstName", "lastName", "password") VALUES  ${query};`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
