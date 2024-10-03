import type { NextFunction, Request, Response } from 'express';
import { LoginWithEmailDto } from '../dto/login-with-email.dto';
import { LoginService } from '../service/login.service';

export namespace AuthController {
	export const get = (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		response.json({ hi: 'hello' });
	};

	export const login = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const { accessToken } = await LoginService.loginWithEmail(
			LoginWithEmailDto.dto.parse({
				email: request.body.email,
				password: request.body.password,
			}),
		);
		return { accessToken };
	};
}
