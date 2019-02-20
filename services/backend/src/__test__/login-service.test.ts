import { IPasswordOracle } from "../services/login-service/IPasswordOracle";
import { LoginService } from "../services/login-service/LoginService";
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';

const privateKey = uuid();
const mockedDefaultPasswordOracle: IPasswordOracle = {
	passwordIdValid: async (password) => true
}

describe('password validity', () => {
	test('valid password', async () => {
		const mockedPasswordOracle: IPasswordOracle = {
			passwordIdValid: async (password) => true
		}
		const loginService = new LoginService(privateKey, mockedPasswordOracle);

		const isPasswordValid = await loginService.passwordIsValid('somepassword');

		expect(isPasswordValid).toBe(true);
	});

	test('invalid password', async () => {
		const mockedPasswordOracle: IPasswordOracle = {
			passwordIdValid: async (password) => false
		}
		const loginService = new LoginService(privateKey, mockedPasswordOracle);

		const isPasswordValid = await loginService.passwordIsValid('somepassword');

		expect(isPasswordValid).toBe(false);
	});
});

describe('access token creation', () => {
	test('valid payload', () => {
		const loginService = new LoginService(privateKey, mockedDefaultPasswordOracle);

		const accessTokenFromObj = loginService.createAccessToken({ some: 'object', with: 'valid', num: 42 });

		expect(accessTokenFromObj).toBeDefined();
	});

	test('not supported payload', () => {
		const loginService = new LoginService(privateKey, mockedDefaultPasswordOracle);

		expect(() => loginService.createAccessToken(42)).toThrow(`Payload of type ${typeof 42} is not suitable for an access token`);
		expect(() => loginService.createAccessToken(false)).toThrow(`Payload of type ${typeof false} is not suitable for an access token`);
		expect(() => loginService.createAccessToken('somestring')).toThrow(`Payload of type ${typeof 'somestring'} is not suitable for an access token`);
		expect(() => loginService.createAccessToken(Buffer.from('somestring'))).toThrow(`Payload of type ${typeof Buffer.from('somestring')} is not suitable for an access token`);
		expect(() => loginService.createAccessToken(null)).toThrow(`Payload of type ${typeof null} is not suitable for an access token`);
		expect(() => loginService.createAccessToken(undefined)).toThrow(`Payload of type ${typeof undefined} is not suitable for an access token`);
	});
});

describe('access token validation', () => {
	const payload = { some: 'object', with: 'valid', num: 42 };

	test('valid access token', () => {
		const loginService = new LoginService(privateKey, mockedDefaultPasswordOracle);
		const accessToken = loginService.createAccessToken(payload);

		expect(loginService.accessTokenIsValid(accessToken)).toBeTruthy();
	});

	test('expired access token', () => {
		const loginService = new LoginService(privateKey, mockedDefaultPasswordOracle);
		const accessToken = jwt.sign(payload, privateKey, { expiresIn: -10 });

		expect(loginService.accessTokenIsValid(accessToken)).toBeFalsy();
	});

	test('access token created with another private keys', () => {
		const loginService = new LoginService(privateKey, mockedDefaultPasswordOracle);
		const accessToken = jwt.sign(payload, 'otherprivatekey', { expiresIn: 100 });

		expect(loginService.accessTokenIsValid(accessToken)).toBeFalsy();
	});

	test('invalid access token', () => {
		const loginService = new LoginService(privateKey, mockedDefaultPasswordOracle);
		const accessToken = 'someinvalidaccesstoken';

		expect(loginService.accessTokenIsValid(accessToken)).toBeFalsy();
	});
});