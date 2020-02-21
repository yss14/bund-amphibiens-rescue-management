import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";
import { makeExpressServer } from "../rest/make-express-server";
import { makeSheetsRouter } from "../rest/make-sheets-router";
import { sheetTemplate1 } from "./utils/sheet-templates";
import supertest = require("supertest");
import { HTTPStatusCode } from "../types/HTTPStatusCode";
import { jsonParsedObject } from "./utils/json-parsed-object";
import { ISheet, ISheetTableItem } from "../../../shared-types/ISheet";
import moment = require("moment");

const cleanUpHooks: (() => Promise<void>)[] = [];

afterAll(async () => {
	await Promise.all(cleanUpHooks.map(hook => hook()));
});

const expectCheckerFail = (httpResponse: supertest.Response, property: string) => {
	expect(httpResponse.status).toBe(HTTPStatusCode.BAD_REQUEST);
	expect(httpResponse.body.errors.length).toBe(1);
	expect(httpResponse.body.errors[0].indexOf(`${property} expected`) > -1).toBe(true);
}

const executeCreateSheetWithInvalidProperty = async (property: keyof ISheet, value: any) => {
	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, null as any)

	const sheet: ISheet = { ...sheetTemplate1, [property]: value as any };

	const httpResponse = await supertest(expressApp)
		.post(`/sheets`)
		.send(sheet);

	expectCheckerFail(httpResponse, property);
}

const executeCreateSheetWithInvalidTableItemProperty = async (property: keyof ISheetTableItem, index: number, value: any) => {
	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, null as any)

	const sheet: ISheet = {
		...sheetTemplate1,
		tableItems: sheetTemplate1.tableItems.map((tableItem, idx) =>
			idx === index ? { ...tableItem, [property]: value } : tableItem)
	};

	const httpResponse = await supertest(expressApp)
		.post(`/sheets`)
		.send(sheet);

	expectCheckerFail(httpResponse, property);
}

test('create valid sheet', async () => {
	const { sheetService, cleanup } = await makeUniqueTestSheetService();
	cleanUpHooks.push(cleanup);
	const expressApp = makeExpressServer();
	makeSheetsRouter(expressApp, sheetService)

	const httpResponse = await supertest(expressApp)
		.post(`/sheets`)
		.set('Content-Type', 'application/json')
		.send(sheetTemplate1);

	expect(httpResponse.status).toBe(HTTPStatusCode.CREATED);
	expect(httpResponse.body).toMatchObject(jsonParsedObject(sheetTemplate1));
});

test('create sheet with invalid dateOfRecord', async () => {
	(moment as any).suppressDeprecationWarnings = true;

	await Promise.all([
		executeCreateSheetWithInvalidProperty('dateOfRecord', 42),
		executeCreateSheetWithInvalidProperty('dateOfRecord', 'somestring'),
		executeCreateSheetWithInvalidProperty('dateOfRecord', false),
		executeCreateSheetWithInvalidProperty('dateOfRecord', { some: 'object' }),
		executeCreateSheetWithInvalidProperty('dateOfRecord', null),
		executeCreateSheetWithInvalidProperty('dateOfRecord', undefined),
	]);
});

test('create sheet with invalid secretary', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidProperty('secretary', false),
		executeCreateSheetWithInvalidProperty('secretary', 42),
		executeCreateSheetWithInvalidProperty('secretary', { some: 'object' }),
		executeCreateSheetWithInvalidProperty('secretary', null),
		executeCreateSheetWithInvalidProperty('secretary', undefined),
	]);
});

test('create sheet with invalid temperature', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidProperty('temperature', false),
		executeCreateSheetWithInvalidProperty('temperature', 'somestring'),
		executeCreateSheetWithInvalidProperty('temperature', { some: 'object' }),
		executeCreateSheetWithInvalidProperty('temperature', null),
		executeCreateSheetWithInvalidProperty('temperature', undefined),
	]);
});

test('create sheet with invalid cloudiness', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidProperty('cloudiness', 'invalid_value'),
		executeCreateSheetWithInvalidProperty('cloudiness', 42),
		executeCreateSheetWithInvalidProperty('cloudiness', false),
		executeCreateSheetWithInvalidProperty('cloudiness', { some: 'object' }),
		executeCreateSheetWithInvalidProperty('cloudiness', null),
		executeCreateSheetWithInvalidProperty('cloudiness', undefined),
	]);
});

test('create sheet with invalid precipitation', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidProperty('precipitation', 42),
		executeCreateSheetWithInvalidProperty('precipitation', 'somestring'),
		executeCreateSheetWithInvalidProperty('precipitation', { some: 'object' }),
		executeCreateSheetWithInvalidProperty('precipitation', null),
		executeCreateSheetWithInvalidProperty('precipitation', undefined),
	]);
});

test('create sheet with invalid bucketNumber in table item', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidTableItemProperty('bucketNumber', 0, false),
		executeCreateSheetWithInvalidTableItemProperty('bucketNumber', 0, 'somestring'),
		executeCreateSheetWithInvalidTableItemProperty('bucketNumber', 0, { some: 'object' }),
		executeCreateSheetWithInvalidTableItemProperty('bucketNumber', 0, null),
		executeCreateSheetWithInvalidTableItemProperty('bucketNumber', 0, undefined),
	]);
});

test('create sheet with invalid amphibiansKind in table item', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidTableItemProperty('amphibiansKind', 1, false),
		executeCreateSheetWithInvalidTableItemProperty('amphibiansKind', 1, 42),
		executeCreateSheetWithInvalidTableItemProperty('amphibiansKind', 1, { some: 'object' }),
		executeCreateSheetWithInvalidTableItemProperty('amphibiansKind', 1, null),
		executeCreateSheetWithInvalidTableItemProperty('amphibiansKind', 1, undefined),
	]);
});

test('create sheet with invalid amount in table item', async () => {
	await Promise.all([
		executeCreateSheetWithInvalidTableItemProperty('amount', 2, false),
		executeCreateSheetWithInvalidTableItemProperty('amount', 2, 'somestring'),
		executeCreateSheetWithInvalidTableItemProperty('amount', 2, { some: 'object' }),
		executeCreateSheetWithInvalidTableItemProperty('amount', 2, null),
		executeCreateSheetWithInvalidTableItemProperty('amount', 2, undefined),
	]);
});