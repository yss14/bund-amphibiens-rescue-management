import * as Express from 'express';
import { LoginService } from "../services/login-service/LoginService";
import { makePostLoginRoute } from './routes/post-login';

export const makeLoginRouter = (expressApp: Express.Application, loginService: LoginService) => {
	const router = Express.Router();

	router.post('/', makePostLoginRoute(loginService));

	expressApp.use('/login', router)
}