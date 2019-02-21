import * as Express from 'express';
import { LoginService } from "../../services/login-service/LoginService";
import { HTTPStatusCode } from '../../types/HTTPStatusCode';

const isValidName = (name: any): name is string => {
	return typeof name === 'string' && name.trim().length > 0;
}

const isValidPassword = (password: any): password is string => {
	return typeof password === 'string' && password.trim().length > 0;
}

export const makePostLoginRoute = (loginService: LoginService): Express.RequestHandler => async (req, res) => {
	const { name, password } = req.body;

	if (!isValidName(name)) {
		return res.status(HTTPStatusCode.BAD_REQUEST).json({ error: 'Body property <name> is missing or invalid' });
	}

	if (!isValidPassword(password)) {
		return res.status(HTTPStatusCode.BAD_REQUEST).json({ error: 'Body property <password> is missing or invalid' });
	}

	const passwordIsValid = await loginService.passwordIsValid(password);

	if (!passwordIsValid) {
		return res.status(HTTPStatusCode.UNAUTHORIZED).end();
	}

	const authToken = loginService.createAccessToken({
		name
	});

	return res.status(HTTPStatusCode.CREATED).json({ authToken });
}