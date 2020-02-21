import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";
import { makeExpressServer } from "../rest/make-express-server";
import { makeSheetsRouter } from "../rest/make-sheets-router";
import { sheetTemplate1 } from "./utils/sheet-templates";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";

const cleanUpHooks: (() => Promise<void>)[] = [];

afterAll(async () => {
	await Promise.all(cleanUpHooks.map(hook => hook()));
});

test('delete existing sheet', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, sheetService)

	const createdSheet = await sheetService.createSheet(sheetTemplate1);

	const httpResponse = await supertest(expressApp)
		.delete(`/sheets/${createdSheet.id}`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.NO_CONTENT);
	expect(httpResponse.body).toEqual({});
});

test('delete not-existing sheet', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, sheetService)

	const notExistingID = '5c6082cea068a184fc11aaaa';

	const httpResponse = await supertest(expressApp)
		.delete(`/sheets/${notExistingID}`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.NOT_FOUND);
});

test('delete sheet by invalid shareID', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, sheetService)

	const httpResponse = await supertest(expressApp)
		.delete(`/sheets/invalidid`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
});

test('delete sheet with unexpected database error', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);

	sheetService.deleteSheet = () => { throw new Error('Unexpected database error') };

	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, sheetService)

	const httpResponse = await supertest(expressApp)
		.delete(`/sheets/invalidid`)
		.send();

	expect(httpResponse.status).toBe(HTTPStatusCode.INTERNAL_SERVER_ERROR);
});