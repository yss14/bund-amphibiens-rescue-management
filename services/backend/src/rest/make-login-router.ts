import * as Express from 'express';
import { LoginService } from "../services/login-service/LoginService";
import { makePostLoginRoute } from './routes/post-login';

export const makeLoginRouter = (loginService: LoginService) => {
	const router = Express.Router();

	router.post('/login', makePostLoginRoute(loginService));

	return router;
}