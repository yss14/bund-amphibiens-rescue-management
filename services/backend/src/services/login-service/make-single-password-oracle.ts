import { CustomEnv } from "../../utils/env/CustomEnv";
import { SinglePasswordOracle } from "./SinglePasswordOracle";

export const makeSinglePasswordOracleFromEnvVar = async (envVar: CustomEnv) => {
	const passwordPlaintext = process.env[envVar];

	/* istanbul ignore next */
	if (typeof passwordPlaintext !== 'string' || passwordPlaintext.length === 0) {
		throw new Error(`Env var ${envVar} is missing`);
	}

	const singlePasswordOracle = new SinglePasswordOracle();
	await singlePasswordOracle.setPassword(passwordPlaintext);

	return singlePasswordOracle;
}