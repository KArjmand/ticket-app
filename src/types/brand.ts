import type z from 'zod';

export type Brand<K, T extends string> = K & z.BRAND<T>;
