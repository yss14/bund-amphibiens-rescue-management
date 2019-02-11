import { CustomEnv } from "../utils/env/CustomEnv";
import { MongoClientOptions, MongoClient } from "mongodb";

export const makeAndConnectDatabase = async (dbName?: string) => {
	const mongoDBHost = process.env[CustomEnv.MONGODB_HOST];
	const mongoDBPort = process.env[CustomEnv.MONGODB_PORT];
	const mongoDBUser = process.env[CustomEnv.MONGODB_USER];
	const mongoDBPassword = process.env[CustomEnv.MONGODB_PASSWORD];
	const mongoDBDatabase = dbName || process.env[CustomEnv.MONGODB_DATABASE];
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

	const connection = new MongoClient(mongoDBUrl, opts);

	await connection.connect();

	const database = connection.db(mongoDBDatabase);

	return { database, connection };
}