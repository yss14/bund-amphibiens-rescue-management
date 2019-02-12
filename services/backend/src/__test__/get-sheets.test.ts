import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";
import { makeExpressServer } from "../rest/make-express-server";
import { makeDefaultRouter } from "../rest/make-default-router";
import { sheetTemplate1, sheetTemplate2 } from "./utils/sheet-templates";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";
import { jsonParsedObject } from "./utils/json-parsed-object";

const cleanUpHooks: (() => Promise<void>)[] = [];

afterAll(async () => {
	await Promise.all(cleanUpHooks.map(hook => hook()));
});

test('get list of existing sheets', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeDefaultRouter(sheetService));

	const createdSheet1 = await sheetService.createSheet(sheetTemplate1);
	const createdSheet2 = await sheetService.createSheet(sheetTemplate2);

	const httpResponse = await supertest(expressApp)
		.get(`/sheets`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.OK);
	expect(httpResponse.body).toEqual(jsonParsedObject([createdSheet1, createdSheet2]));
});

test('get empty list of sheets', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeDefaultRouter(sheetService));

	const httpResponse = await supertest(expressApp)
		.get(`/sheets`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.OK);
	expect(httpResponse.body).toEqual([]);
});