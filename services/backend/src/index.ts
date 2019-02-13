import { isValidNodeEnvironment } from "./utils/env/native-envs";
import { __PROD__, __DEV__ } from "./utils/env/env-constants";
import { loadEnvsFromDotenvFile } from "./utils/env/load-envs-from-file";
import { SheetService } from "./services/sheet-service/SheetService";
import { makeAndConnectDatabase } from "./database/make-database";
import { makeExpressServer, makeHTTPServerAndStartExpress } from "./rest/make-express-server";
import { CustomEnv } from "./utils/env/CustomEnv";
import { tryParseInt } from "./utils/try-parse";
import { makeSheetsRouter } from "./rest/make-sheets-router";
import { seedDatabase } from "./database/seed-database";

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

	if (__DEV__) {
		await seedDatabase(sheetService);
	}

	const sheetsRouter = makeSheetsRouter(sheetService);
	const expressApp = makeExpressServer(sheetsRouter);

	const restPort = tryParseInt(process.env[CustomEnv.REST_PORT] || '3000', 3000);
	await makeHTTPServerAndStartExpress(expressApp, restPort);

	console.info(`Server is running of port ${restPort}`);
})();