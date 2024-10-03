import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1727951870388 implements MigrationInterface {
	name = 'Migrations1727951870388';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "_tag" character varying NOT NULL, "senderId" uuid NOT NULL, "subject" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "assign" jsonb NOT NULL DEFAULT '[]', "seenBy" jsonb NOT NULL DEFAULT '[]', "taker_tag" character varying NOT NULL, "takerUserid" uuid, "takerTopic" character varying, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "ticket_chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "_tag" character varying NOT NULL, "ticketId" uuid NOT NULL, "userId" uuid NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5f476d3c71a0a406a2b3bba5478" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "tickets" ADD CONSTRAINT "FK_797522e412e6924b661c2b0d81e" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4e76ac2d2792f0c249fab749968" FOREIGN KEY ("takerUserid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "ticket_chats" ADD CONSTRAINT "FK_3a3184134186ed0165de7560320" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "ticket_chats" ADD CONSTRAINT "FK_e257e18f3754e321c7181b12b6f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ticket_chats" DROP CONSTRAINT "FK_e257e18f3754e321c7181b12b6f"`,
		);
		await queryRunner.query(
			`ALTER TABLE "ticket_chats" DROP CONSTRAINT "FK_3a3184134186ed0165de7560320"`,
		);
		await queryRunner.query(
			`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4e76ac2d2792f0c249fab749968"`,
		);
		await queryRunner.query(
			`ALTER TABLE "tickets" DROP CONSTRAINT "FK_797522e412e6924b661c2b0d81e"`,
		);
		await queryRunner.query(`DROP TABLE "ticket_chats"`);
		await queryRunner.query(`DROP TABLE "tickets"`);
	}
}
