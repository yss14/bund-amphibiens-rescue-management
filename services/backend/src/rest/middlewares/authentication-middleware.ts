import { LoginService } from "../../services/login-service/LoginService";
import * as Express from 'express';
import { HTTPStatusCode } from "../../types/HTTPStatusCode";

export const makeAuthMiddleware = (loginService: LoginService): Express.RequestHandler => (req, res, next): any => {
	const accessToken = req.headers.authorization;

	if (accessToken === undefined) {
		return res.status(HTTPStatusCode.UNAUTHORIZED).json({ error: 'Authorization header missing' });
	}

	if (!loginService.accessTokenIsValid(accessToken)) {
		return res.status(HTTPStatusCode.UNAUTHORIZED).json({ error: 'Access token not valid' });
	}

	next();
}