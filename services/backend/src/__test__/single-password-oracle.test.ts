import { SinglePasswordOracle } from "../services/login-service/SinglePasswordOracle";

const password = '@somevalidpassword#123';

test('valid password', async () => {
	const passwordOracle = new SinglePasswordOracle();
	await passwordOracle.setPassword(password);

	await expect(passwordOracle.passwordIsValid(password)).resolves.toBeTruthy();
});

test('invalid password', async () => {
	const passwordOracle = new SinglePasswordOracle();
	await passwordOracle.setPassword(password);

	await expect(passwordOracle.passwordIsValid('@someinvalidpassword#123')).resolves.toBeFalsy();
});

test('not initialized oracle', async () => {
	const passwordOracle = new SinglePasswordOracle();

	await expect(passwordOracle.passwordIsValid('@somepassword#123')).rejects.toThrow('pchstr must be a non-empty string');
});