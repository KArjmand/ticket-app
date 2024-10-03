import { z } from 'zod';
import { Email } from '../../../types/email';
import { NonEmptyString } from '../../../types/non-empty-string';

export type LoginWithEmailDto = LoginWithEmailDto.DTO;
export namespace LoginWithEmailDto {
	export const dto = z.object({
		email: Email.zod,
		password: NonEmptyString.zod,
	});

	export type DTO = z.TypeOf<typeof dto>;
}
