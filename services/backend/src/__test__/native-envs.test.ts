import { isValidNodeEnvironment } from "../utils/env/native-envs";
import { __PROD__ } from "../utils/env/env-constants";

describe('isValidNodeEnvironment()', () => {
	test('development', () => {
		const isValidNodeEnv = isValidNodeEnvironment('development');

		expect(isValidNodeEnv).toBe(true);
	});

	test('test', () => {
		const isValidNodeEnv = isValidNodeEnvironment('test');

		expect(isValidNodeEnv).toBe(true);
	});

	test('production', () => {
		const isValidNodeEnv = isValidNodeEnvironment('production');

		expect(isValidNodeEnv).toBe(true);
	});

	test('invalid node environment', () => {
		const isValidNodeEnv = isValidNodeEnvironment('someinvalidenv');

		expect(isValidNodeEnv).toBe(false);
	});

	test('empty string', () => {
		const isValidNodeEnv = isValidNodeEnvironment('');

		expect(isValidNodeEnv).toBe(false);
	});

	test('undefined', () => {
		const isValidNodeEnv = isValidNodeEnvironment(undefined);

		expect(isValidNodeEnv).toBe(false);
	});
});