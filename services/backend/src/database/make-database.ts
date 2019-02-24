import { CustomEnv } from "../utils/env/CustomEnv";
import { MongoClientOptions, MongoClient } from "mongodb";

export const makeAndConnectDatabase = async (dbName?: string) => {
	const mongoDBHost = process.env[CustomEnv.MONGODB_HOST];
	const mongoDBPort = process.env[CustomEnv.MONGODB_PORT];
	const mongoDBUser = process.env[CustomEnv.MONGODB_USER];
	const mongoDBPassword = process.env[CustomEnv.MONGODB_PASSWORD];
	const mongoDBDatabase = dbName || process.env[CustomEnv.MONGODB_DATABASE];
	const mongoDBUrl = `mongodb://${mongoDBHost}:${mongoDBPort}`;
	const connectionString = process.env[CustomEnv.MONGODB_CONNECTION_STRING];

	const opts: MongoClientOptions = {
		useNewUrlParser: true
	};

	/* istanbul ignore next */
	if (mongoDBUser && mongoDBPassword) {
		opts.auth = {
			user: mongoDBUser,
			password: mongoDBPassword
		}
	}

	let finalUrl = connectionString || mongoDBUrl;

	const connection = new MongoClient(finalUrl, opts);

	await connection.connect();

	const database = connection.db(mongoDBDatabase);

	return { database, connection };
}