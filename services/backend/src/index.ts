import { isValidNodeEnvironment } from "./utils/env/native-envs";
import { __PROD__ } from "./utils/env/env-constants";
import { loadEnvsFromDotenvFile } from "./utils/env/load-envs-from-file";
import { SheetService } from "./services/sheet-service/SheetService";
import { makeAndConnectDatabase } from "./database/make-database";
import { makeExpressServer, makeHTTPServerAndStartExpress } from "./rest/make-express-server";
import { CustomEnv } from "./utils/env/CustomEnv";
import { tryParseInt } from "./utils/try-parse";

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

	const sheetService = new SheetService(database);

	const restPort = tryParseInt(process.env[CustomEnv.REST_PORT] || '3000', 3000);
	const expressApp = makeExpressServer();
	await makeHTTPServerAndStartExpress(expressApp, restPort);
})();