import * as Express from "express";
import { makeExpressServer, makeHTTPServerAndStartExpress } from "../rest/make-express-server";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";

test('start server successfully', async (done) => {
	const expressApp = makeExpressServer();

	const httpServer = await makeHTTPServerAndStartExpress(expressApp, 5555);

	httpServer.close(() => done());
})

test('start server on occupied port', async (done) => {
	const expressApp = makeExpressServer();

	const httpServer = await makeHTTPServerAndStartExpress(expressApp, 5556);

	await expect(makeHTTPServerAndStartExpress(expressApp, 5556)).rejects.toThrow();

	httpServer.close(() => done());
})

test('catching error', async () => {
	const throwingRouter = Express.Router();
	throwingRouter.get('/throwingroute', () => { throw new Error('Some error') });

	const expressApp = makeExpressServer(throwingRouter);

	const httpResponse = await supertest(expressApp)
		.get('/throwingroute')
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.INTERNAL_SERVER_ERROR);
});