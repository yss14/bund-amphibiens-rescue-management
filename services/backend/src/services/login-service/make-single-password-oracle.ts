import { CustomEnv } from "../../utils/env/CustomEnv";
import { SinglePasswordOracle } from "./SinglePasswordOracle";

export const makeSinglePasswordOracleFromEnvVars = async (envVar: CustomEnv) => {
	const passwordPlaintext = process.env[envVar];

	if (!passwordPlaintext) {
		throw new Error(`Env var ${envVar} is missing`);
	}

	const singlePasswordOracle = new SinglePasswordOracle();
	await singlePasswordOracle.setPassword(passwordPlaintext);

	return singlePasswordOracle;
}