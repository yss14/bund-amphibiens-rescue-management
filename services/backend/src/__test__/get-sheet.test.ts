import { makeDefaultRouter } from "../rest/make-default-router";
import { makeExpressServer } from "../rest/make-express-server";
import * as supertest from "supertest";
import { sheetTemplate1 } from "./utils/sheet-templates";
import { HTTPStatusCode } from "../types/HTTPStatusCode";
import { jsonParsedObject } from "./utils/json-parsed-object";
import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";

test('get existing sheet', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	const expressApp = makeExpressServer(makeDefaultRouter(sheetService));

	const createdSheet = await sheetService.createSheet(sheetTemplate1);

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/${createdSheet.id}`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.OK);
	expect(httpResponse.body).toEqual(jsonParsedObject(createdSheet));

	await cleanup();
});

test('get sheet by invalid sheetID', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	const expressApp = makeExpressServer(makeDefaultRouter(sheetService));

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/42`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);

	await cleanup();
});

test('get sheet by not-existing sheetID', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	const expressApp = makeExpressServer(makeDefaultRouter(sheetService));

	const notExistingID = '5c6082cea068a184fc11aaaa';

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/${notExistingID}`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.NOT_FOUND);

	await cleanup();
});