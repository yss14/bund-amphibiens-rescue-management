import { isValidNodeEnvironment } from "./utils/env/native-envs";
import { __PROD__ } from "./utils/env/env-constants";
import { loadEnvsFromDotenvFile } from "./utils/env/load-envs-from-file";
import { MongoClient, MongoClientOptions } from "mongodb";
import { CustomEnv } from "./utils/env/CustomEnv";
import { FormService } from "./services/form-service/FormService";

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
	const mongoDBHost = process.env[CustomEnv.MONGODB_HOST];
	const mongoDBPort = process.env[CustomEnv.MONGODB_PORT];
	const mongoDBUser = process.env[CustomEnv.MONGODB_USER];
	const mongoDBPassword = process.env[CustomEnv.MONGODB_PASSWORD];
	const mongoDBDatabase = process.env[CustomEnv.MONGODB_DATABASE];
	const mongoDBUrl = `mongodb://${mongoDBHost}:${mongoDBPort}`;

	const opts: MongoClientOptions = {
		useNewUrlParser: true
	};

	if (mongoDBUser && mongoDBPassword) {
		opts.auth = {
			user: mongoDBUser,
			password: mongoDBPassword
		}
	}

	const databaseConnection = new MongoClient(mongoDBUrl, opts);

	await databaseConnection.connect();

	const database = databaseConnection.db(mongoDBDatabase);

	const formService = new FormService(database);
})();