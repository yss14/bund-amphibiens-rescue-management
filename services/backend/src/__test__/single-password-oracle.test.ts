import { SinglePasswordOracle } from "../services/login-service/SinglePasswordOracle";
import { makeSinglePasswordOracleFromEnvVar } from "../services/login-service/make-single-password-oracle";
import { CustomEnv } from "../utils/env/CustomEnv";

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

test('make single password oracle from env var', async () => {
	const password = 'somerandompassword';
	process.env[CustomEnv.LOGIN_PASSWORD] = password;

	const passwordOracle = await makeSinglePasswordOracleFromEnvVar(CustomEnv.LOGIN_PASSWORD);

	await expect(passwordOracle.passwordIsValid(password)).toBeTruthy();
});