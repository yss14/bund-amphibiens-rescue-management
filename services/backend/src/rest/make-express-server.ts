import * as Express from "express";
import * as BodyParser from 'body-parser';
import * as Cors from 'cors';
import * as Morgan from 'morgan';
import * as http from 'http';
import { HTTPStatusCode } from "../types/HTTPStatusCode";
import { __TEST__ } from "../utils/env/env-constants";

export const makeExpressServer = (...routers: Express.Router[]) => {
	const expressApp = Express();

	expressApp.use(Cors());
	expressApp.use(BodyParser.json({ strict: false }));
	expressApp.use(BodyParser.urlencoded({ extended: true }));
	expressApp.disable('x-powered-by');

	/* istanbul ignore if */
	if (!__TEST__) {
		expressApp.use(Morgan('dev'));
	}

	if (routers.length > 0) {
		expressApp.use(routers);
	}

	expressApp.use((err: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
		/* istanbul ignore if */
		if (!__TEST__) {
			console.error(err);
		}

		res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({ error: err.message });
	});

	return expressApp;
}

export const makeHTTPServerAndStartExpress = (expressApp: Express.Application, port: number) => {
	return new Promise<http.Server>((resolve, reject) => {
		const httpServer = http.createServer(expressApp);

		httpServer.on('error', (err) => reject(err));

		httpServer.listen(port, () => {
			resolve(httpServer);
		});
	});
}