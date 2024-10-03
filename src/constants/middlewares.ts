import type { NextFunction, Request, Response } from 'express';
import { AccessToken } from '../modules/auth/domain/access-token';
import { ForbiddenError } from './errors';

// Authentication middleware
export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Get the token from the request headers
	const token = req.headers.authorization?.split(' ')[1];
	const accessToken = token ? AccessToken.mk(token) : undefined;
	if (!accessToken)
		return res.status(401).json({ message: 'No token provided' });

	// Verify the token

	try {
		const userAuth = AccessToken.verify(accessToken);
		req.userAuth = userAuth;
		next();
	} catch (err) {
		next(new ForbiddenError('Jwt expired.'));
	}
};
