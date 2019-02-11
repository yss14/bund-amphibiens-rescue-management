import { isValidNodeEnvironment } from "./utils/env/native-envs";
import { __PROD__ } from "./utils/env/env-constants";
import { loadEnvsFromDotenvFile } from "./utils/env/load-envs-from-file";
import { FormService } from "./services/form-service/FormService";
import { makeAndConnectDatabase } from "./database/make-database";

// enable source map support for error stacks
require('source-map-support').install();

const nodeEnv = process.env.NODE_ENV;

if (!isValidNodeEnvironment(nodeEnv)) {
	throw new Error(`Invalid node environment ${nodeEnv}`);
}

if (!__PROD__) {
	loadEnvsFromDotenvFile(nodeEnv);
}

(async () => {
	const { database } = await makeAndConnectDatabase();

	const formService = new FormService(database);
})();