import { makeSheetsRouter } from "../rest/make-sheets-router";
import { makeExpressServer } from "../rest/make-express-server";
import * as supertest from "supertest";
import { sheetTemplate1 } from "./utils/sheet-templates";
import { HTTPStatusCode } from "../types/HTTPStatusCode";
import { jsonParsedObject } from "./utils/json-parsed-object";
import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";

const cleanUpHooks: (() => Promise<void>)[] = [];

afterAll(async () => {
	await Promise.all(cleanUpHooks.map(hook => hook()));
});

test('get existing sheet', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeSheetsRouter(sheetService));

	const createdSheet = await sheetService.createSheet(sheetTemplate1);

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/${createdSheet.id}`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.OK);
	expect(httpResponse.body).toEqual(jsonParsedObject(createdSheet));
});

test('get sheet by invalid sheetID', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeSheetsRouter(sheetService));

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/42`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
});

test('get sheet by not-existing sheetID', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeSheetsRouter(sheetService));

	const notExistingID = '5c6082cea068a184fc11aaaa';

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/${notExistingID}`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.NOT_FOUND);
});

test('get sheet with unexpected database error', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);

	sheetService.getSheet = () => { throw new Error('Unexpected database error') };

	const expressApp = makeExpressServer(makeSheetsRouter(sheetService));

	const httpResponse = await supertest(expressApp)
		.get(`/sheets/5c6082cea068a184fc11aaaa`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.INTERNAL_SERVER_ERROR);
});