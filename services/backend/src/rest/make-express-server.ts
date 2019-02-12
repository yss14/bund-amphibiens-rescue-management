import * as Express from "express";
import * as BodyParser from 'body-parser';
import * as Cors from 'cors';
import * as Morgan from 'morgan';
import * as http from 'http';
import { HTTPStatusCode } from "../types/HTTPStatusCode";

export const makeExpressServer = (...routers: Express.Router[]) => {
	const expressApp = Express();

	expressApp.use(Cors());
	expressApp.use(BodyParser.json({ strict: false }));
	expressApp.use(BodyParser.urlencoded({ extended: true }));
	expressApp.use(Morgan('dev'));
	expressApp.disable('x-powered-by');

	expressApp.use(routers);

	expressApp.use((err: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
		console.error(err);

		res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).send(err.message).end();
	});

	return expressApp;
}

export const makeHTTPServerAndStartExpress = (expressApp: Express.Application, port: number) => {
	return new Promise((resolve, reject) => {
		const httpServer = http.createServer(expressApp);

		httpServer.on('error', (err) => reject(err));

		httpServer.listen(port, () => {
			resolve();
		});
	});
}