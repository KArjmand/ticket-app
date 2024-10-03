import { join as pathJoin } from 'node:path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import {
	NODE_ENV,
	POSTGRES_DATABASE,
	POSTGRES_DROP_SCHEMA,
	POSTGRES_HOST,
	POSTGRES_LOGGING,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
	POSTGRES_SYNCHRONIZE,
	POSTGRES_USER,
} from '../environments';

const orm: {
	development: DataSourceOptions;
	test: DataSourceOptions;
	production: DataSourceOptions;
} = {
	development: {
		type: 'postgres',
		host: POSTGRES_HOST,
		port: POSTGRES_PORT,
		username: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DATABASE,
		logging: POSTGRES_LOGGING,
		synchronize: POSTGRES_SYNCHRONIZE,
	},
	test: {
		type: 'postgres',
		host: POSTGRES_HOST,
		port: POSTGRES_PORT,
		username: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DATABASE,
		logging: POSTGRES_LOGGING,
		synchronize: POSTGRES_SYNCHRONIZE,
		dropSchema: POSTGRES_DROP_SCHEMA,
	},
	production: {
		type: 'postgres',
		host: POSTGRES_HOST,
		port: POSTGRES_PORT,
		username: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DATABASE,
		logging: false,
	},
};
const MIGRATIONS_PATH = 'migrations';

const AppDataSource = new DataSource({
	...orm[NODE_ENV],
	entities: [pathJoin(__dirname, '..', '**/*.entity{.ts,.js}')],
	migrationsTableName: MIGRATIONS_PATH,
	migrations: [pathJoin(__dirname, '..', MIGRATIONS_PATH, '*.ts')],
});

export default AppDataSource;
