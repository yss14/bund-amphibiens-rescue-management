import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";
import { makeExpressServer } from "../rest/make-express-server";
import { makeSheetsRouter } from "../rest/make-sheets-router";
import { sheetTemplate1, sheetTemplate2 } from "./utils/sheet-templates";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";
import { ISheet, ISheetWithID, Cloudiness } from "../../../shared-types/ISheet";
import { jsonParsedObject } from "./utils/json-parsed-object";

const cleanUpHooks: (() => Promise<void>)[] = [];

afterAll(async () => {
	await Promise.all(cleanUpHooks.map(hook => hook()));
});

test('put sheet update meta data and add new table items', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeSheetsRouter(sheetService));

	const oldSheet: ISheet = sheetTemplate1;
	const oldSheetCreated = await sheetService.createSheet(oldSheet);

	const newSheet: ISheetWithID = {
		...oldSheetCreated,
		cloudiness: Cloudiness.Slightly,
		temperature: 15,
		tableItems: sheetTemplate1.tableItems.concat(sheetTemplate2.tableItems)
	};

	const httpResponse = await supertest(expressApp)
		.put(`/sheets/${oldSheetCreated.id}`)
		.send(newSheet);

	expect(httpResponse.status).toBe(HTTPStatusCode.NO_CONTENT);
	expect(httpResponse.body).toEqual({});

	const newSheetFetched = await sheetService.getSheet(newSheet.id);
	expect(newSheetFetched).toEqual(jsonParsedObject(newSheet));
});

test('update meta data and replace whole table items', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer(makeSheetsRouter(sheetService));

	const oldSheet: ISheet = sheetTemplate1;
	const oldSheetCreated = await sheetService.createSheet(oldSheet);

	const newSheet: ISheetWithID = {
		...oldSheetCreated,
		precipitation: false,
		secretary: 'Some new dude',
		tableItems: sheetTemplate2.tableItems
	};

	const httpResponse = await supertest(expressApp)
		.put(`/sheets/${oldSheetCreated.id}`)
		.send(newSheet);

	expect(httpResponse.status).toBe(HTTPStatusCode.NO_CONTENT);
	expect(httpResponse.body).toEqual({});

	const newSheetFetched = await sheetService.getSheet(newSheet.id);
	expect(newSheetFetched).toEqual(jsonParsedObject(newSheet));
});