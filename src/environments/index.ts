import dotenv from 'dotenv';

import { z } from 'zod';
dotenv.config();

export const PORT = process.env.PORT || 3000;

// environments
export const PRODUCTION_ENV = 'production' as const;
export const DEVELOPMENT_ENV = 'development' as const;
export const NODE_ENV = z
	.union([z.literal('production'), z.literal('development'), z.literal('test')])
	.parse(process.env.NODE_ENV || DEVELOPMENT_ENV);

// bcrypt
export const BCRYPT_SALT: number = process.env.BCRYPT_SALT
	? +process.env.BCRYPT_SALT
	: 10;

// jsonwebtoken
export const ISSUER: string = process.env.ISSUER || 'BstCo';
export const AUDIENCE: string = process.env.AUDIENCE || '';
export const SESSION_EXPIRY: string = process.env.SESSION_EXPIRY || '90d';
export const ACCESS_TOKEN_EXPIRY: string =
	process.env.ACCESS_TOKEN_EXPIRY || '10m';
export const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || 'access-token';
export const ACCESS_TOKEN_SECRET: string =
	process.env.ACCESS_TOKEN_SECRET || 'access-token-key';
export const FILE_TOKEN_SECRET: string =
	process.env.FILE_TOKEN_SECRET || 'file-token-key';
export const REFRESH_TOKEN: string =
	process.env.REFRESH_TOKEN || 'refresh-token';

// postgres
export const POSTGRES_HOST: string = process.env.POSTGRES_HOST || 'postgres';
export const POSTGRES_PORT = process.env.POSTGRES_PORT
	? +process.env.POSTGRES_PORT
	: 5432;
export const POSTGRES_USER: string = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD || '';
export const POSTGRES_DATABASE: string =
	process.env.POSTGRES_DATABASE || 'test-user';
export const POSTGRES_LOGGING: boolean =
	process.env.POSTGRES_LOGGING === 'true' || false;
export const POSTGRES_SYNCHRONIZE: boolean =
	process.env.POSTGRES_SYNCHRONIZE === 'true' || false;
export const POSTGRES_DROP_SCHEMA: boolean =
	process.env.POSTGRES_DROP_SCHEMA === 'true' || false;
