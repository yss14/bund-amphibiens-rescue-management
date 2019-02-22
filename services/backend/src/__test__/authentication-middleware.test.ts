import { LoginService } from "../services/login-service/LoginService";
import { IPasswordOracle } from "../services/login-service/IPasswordOracle";
import uuid = require("uuid");
import { makeAuthMiddleware } from "../rest/middlewares/authentication-middleware";
import { HTTPStatusCode } from "../types/HTTPStatusCode";

const makeLoginService = () => {
	const privateKey = uuid();
	const mockedPasswordOracle: IPasswordOracle = {
		passwordIsValid: async (password) => true
	}

	return new LoginService(privateKey, mockedPasswordOracle);
}

const loginService = makeLoginService();
const authToken = loginService.createAccessToken({});
const middleware = makeAuthMiddleware(loginService);

test('valid authentication token', () => {
	const mockedNextFunction = jest.fn(() => undefined);
	const mockedRequest = { headers: { authorization: authToken } };
	const mockedResponse = {
		status: jest.fn(),
		json: jest.fn()
	}

	middleware(mockedRequest as any, mockedResponse as any, mockedNextFunction);

	expect(mockedNextFunction).toBeCalledTimes(1);
	expect(mockedResponse.json).not.toBeCalled();
	expect(mockedResponse.status).not.toBeCalled();
});

test('invalid authentication token', () => {
	const mockedNextFunction = jest.fn(() => undefined);
	const mockedRequest = { headers: { authorization: 'someinvalidtoken' } };
	const mockedResponse = new class {
		public status: jest.Mock<this, [HTTPStatusCode]> = jest.fn((status) => this);
		public json: jest.Mock<this, any> = jest.fn((payload) => this);
	}

	middleware(mockedRequest as any, mockedResponse as any, mockedNextFunction);

	expect(mockedNextFunction).not.toBeCalled();
	expect(mockedResponse.json).toBeCalled();
	expect(mockedResponse.status).toBeCalled();
	expect(mockedResponse.status.mock.calls[0][0]).toBe(HTTPStatusCode.UNAUTHORIZED);
	expect(mockedResponse.json.mock.calls[0][0]).toEqual({ error: 'Access token not valid' });
});

test('missing authetication header', () => {
	const mockedNextFunction = jest.fn(() => undefined);
	const mockedRequest = { headers: {} };
	const mockedResponse = new class {
		public status: jest.Mock<this, [HTTPStatusCode]> = jest.fn((status) => this);
		public json: jest.Mock<this, any> = jest.fn((payload) => this);
	}

	middleware(mockedRequest as any, mockedResponse as any, mockedNextFunction);

	expect(mockedNextFunction).not.toBeCalled();
	expect(mockedResponse.json).toBeCalled();
	expect(mockedResponse.status).toBeCalled();
	expect(mockedResponse.status.mock.calls[0][0]).toBe(HTTPStatusCode.UNAUTHORIZED);
	expect(mockedResponse.json.mock.calls[0][0]).toEqual({ error: 'Authorization header missing' });
});