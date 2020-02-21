import { isValidNodeEnvironment } from "./utils/env/native-envs";
import { __PROD__, __DEV__, __TEST__ } from "./utils/env/env-constants";
import { loadEnvsFromDotenvFile } from "./utils/env/load-envs-from-file";
import { SheetService } from "./services/sheet-service/SheetService";
import { makeAndConnectDatabase } from "./database/make-database";
import { makeExpressServer, makeHTTPServerAndStartExpress } from "./rest/make-express-server";
import { CustomEnv } from "./utils/env/CustomEnv";
import { tryParseInt } from "./utils/try-parse";
import { makeSheetsRouter } from "./rest/make-sheets-router";
import { seedDatabase } from "./database/seed-database";
import { makeSinglePasswordOracleFromEnvVar } from "./services/login-service/make-single-password-oracle";
import { LoginService } from "./services/login-service/LoginService";
import { makeAuthMiddleware } from "./rest/middlewares/authentication-middleware";
import { makeLoginRouter } from "./rest/make-login-router";
import { makeStatisticsRouter } from "./rest/make-statistics-router"
import * as Express from "express";
import { HTTPStatusCode } from "./types/HTTPStatusCode";

require('source-map-support').install();

const nodeEnv = process.env.NODE_ENV;

if (!isValidNodeEnvironment(nodeEnv)) {
	throw new Error(`Invalid node environment ${nodeEnv}`);
}

const getJWTSecret = () => {
	const secret = process.env[CustomEnv.JWT_SECRET];

	if (!secret) {
		throw new Error(`Env var ${CustomEnv.JWT_SECRET} is missing`);
	}

	return secret;
}

if (!__PROD__) {
	loadEnvsFromDotenvFile(nodeEnv);
}

(async () => {
	const passwordOracle = await makeSinglePasswordOracleFromEnvVar(CustomEnv.LOGIN_PASSWORD);
	const jwtSecret = getJWTSecret();
	const loginService = new LoginService(jwtSecret, passwordOracle);
	const authMiddleware = makeAuthMiddleware(loginService);

	const { database } = await makeAndConnectDatabase();

	const sheetService = new SheetService(database);

	if (false && __DEV__) {
		await seedDatabase(sheetService);
	}

	const expressApp: Express.Application = makeExpressServer();

	makeLoginRouter(expressApp, loginService);
	makeSheetsRouter(expressApp, sheetService, authMiddleware);
	makeStatisticsRouter(expressApp, sheetService)

	expressApp.use((err: Error, req: Express.Request, res: Express.Response) => {
		if (!__TEST__) {
			console.error(err);
		}
		res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({ error: err.message });
	});

	const restPort = tryParseInt(process.env[CustomEnv.REST_PORT] || '3000', 3000);
	await makeHTTPServerAndStartExpress(expressApp, restPort);

	console.info(`Server is running of port ${restPort}`);
})()
	.catch(err => console.error(err));