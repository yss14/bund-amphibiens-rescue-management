import * as Express from 'express';
import { makeExpressServer } from "../rest/make-express-server";
import { makeSheetsRouter } from "../rest/make-sheets-router";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";

test('create sheets router with auth middleware', async () => {
	const authMiddleware: Express.RequestHandler = (req, res) => res.status(HTTPStatusCode.UNAUTHORIZED).end();

	const expressApp = makeExpressServer(makeSheetsRouter(null as any, authMiddleware));

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/42`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.UNAUTHORIZED);
});