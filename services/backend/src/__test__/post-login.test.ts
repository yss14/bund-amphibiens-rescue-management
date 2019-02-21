import uuid = require("uuid");
import { IPasswordOracle } from "../services/login-service/IPasswordOracle";
import { LoginService } from "../services/login-service/LoginService";
import { makeExpressServer } from "../rest/make-express-server";
import { makeLoginRouter } from "../rest/make-login-router";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";

const makeLoginService = (passwordIsValid: boolean = true) => {
	const privateKey = uuid();
	const mockedPasswordOracle: IPasswordOracle = {
		passwordIsValid: async (password) => passwordIsValid
	}

	return new LoginService(privateKey, mockedPasswordOracle);
}

test('valid password', async () => {
	const loginService = makeLoginService();
	const expressApp = makeExpressServer(makeLoginRouter(loginService));

	const httpResponse = await supertest(expressApp)
		.post('/login')
		.send({
			name: 'Some name',
			password: 'validpassword'
		});

	expect(httpResponse.status).toBe(HTTPStatusCode.CREATED);
	expect(httpResponse.body.authToken).toBeDefined();
});

test('invalid password', async () => {
	const loginService = makeLoginService(false);
	const expressApp = makeExpressServer(makeLoginRouter(loginService));

	const httpResponse = await supertest(expressApp)
		.post('/login')
		.send({
			name: 'Some name',
			password: 'invalidpassword'
		});

	expect(httpResponse.status).toBe(HTTPStatusCode.UNAUTHORIZED);
	expect(httpResponse.body).toEqual({});
});

test('missing name param', async () => {
	const loginService = makeLoginService();
	const expressApp = makeExpressServer(makeLoginRouter(loginService));

	const httpResponse = await supertest(expressApp)
		.post('/login')
		.send({
			password: 'invalidpassword'
		});

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
	expect(httpResponse.body).toEqual({ error: 'Body property <name> is missing or invalid' });
});

test('invalid name property', async () => {
	const loginService = makeLoginService();
	const expressApp = makeExpressServer(makeLoginRouter(loginService));

	const httpResponse = await supertest(expressApp)
		.post('/login')
		.send({
			name: '',
			password: 'invalidpassword'
		});

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
	expect(httpResponse.body).toEqual({ error: 'Body property <name> is missing or invalid' });
});

test('missing password property', async () => {
	const loginService = makeLoginService();
	const expressApp = makeExpressServer(makeLoginRouter(loginService));

	const httpResponse = await supertest(expressApp)
		.post('/login')
		.send({
			name: 'Some name'
		});

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
	expect(httpResponse.body).toEqual({ error: 'Body property <password> is missing or invalid' });
});

test('invalid password property', async () => {
	const loginService = makeLoginService();
	const expressApp = makeExpressServer(makeLoginRouter(loginService));

	const httpResponse = await supertest(expressApp)
		.post('/login')
		.send({
			name: 'Some name',
			password: ''
		});

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
	expect(httpResponse.body).toEqual({ error: 'Body property <password> is missing or invalid' });
});