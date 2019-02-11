import { SheetService } from "./SheetService";
import { makeAndConnectDatabase } from "../../database/make-database";
import { MongoClient } from "mongodb";
import { ISheet, Cloudiness, ISheetWithID } from "../../../../shared-types/ISheet";
import { v4 as uuid } from 'uuid';

const databaseConnections: MongoClient[] = [];

const makeUniqueSheetService = async () => {
	const randomDBName = uuid().split('-').join('');
	const { database, connection } = await makeAndConnectDatabase(randomDBName);
	const sheetService = new SheetService(database);

	databaseConnections.push(connection);

	return sheetService;
}

const sheetTemplate1: ISheet = {
	cloudiness: Cloudiness.Heavy,
	dateOfRecord: new Date(),
	precipitation: true,
	secretary: 'Some Dude',
	temperature: 21,
	tableItems: [
		{ amphibiansKind: 'Frosch', bucketNumber: 1, amount: 10 },
		{ amphibiansKind: 'Kröte (m)', bucketNumber: 9, amount: 2 },
		{ amphibiansKind: 'Teichmolch', bucketNumber: 3, amount: 5 }
	]
}

const sheetTemplate2: ISheet = {
	cloudiness: Cloudiness.NoClouds,
	dateOfRecord: new Date(),
	precipitation: false,
	secretary: 'Some Other Dude',
	temperature: -10,
	tableItems: [
		{ amphibiansKind: 'Frosch', bucketNumber: 2, amount: 1 },
		{ amphibiansKind: 'Kröte (m)', bucketNumber: 4, amount: 3 },
		{ amphibiansKind: 'Teichmolch', bucketNumber: 5, amount: 4 },
		{ amphibiansKind: 'Kröte (w)', bucketNumber: 7, amount: 8 }
	]
}

afterAll(async () => {
	await Promise.all(databaseConnections.map(dbConn => dbConn.close()));
});

describe('get sheet', async () => {
	test('get existing sheet', async () => {
		const sheetService = await makeUniqueSheetService();

		const createdSheet = await sheetService.createSheet(sheetTemplate1);

		const fetchedSheet = await sheetService.getSheet(createdSheet.id);

		expect(fetchedSheet).toEqual(createdSheet);
	});

	test('get not-existing sheet', async () => {
		const sheetService = await makeUniqueSheetService();

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await expect(sheetService.getSheet(notExistingID))
			.rejects.toThrow(`Sheet with id ${notExistingID} not found in database`);
	});

	test('get sheet by invalid id', async () => {
		const sheetService = await makeUniqueSheetService();

		await expect(sheetService.getSheet('invalidid'))
			.rejects.toThrow('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	});
});

describe('get sheets', () => {
	test('get sheets of empty database', async () => {
		const sheetService = await makeUniqueSheetService();

		const sheets = await sheetService.getAllSheets();

		expect(sheets).toEqual([]);
	});

	test('get sheets', async () => {
		const sheetService = await makeUniqueSheetService();

		const createdSheet1 = await sheetService.createSheet(sheetTemplate1);
		const createdSheet2 = await sheetService.createSheet(sheetTemplate2);

		const sheets = await sheetService.getAllSheets();

		expect(sheets).toEqual([
			createdSheet1,
			createdSheet2
		]);
	});
});

describe('update sheet', () => {
	test('update meta data and add new table items', async () => {
		const sheetService = await makeUniqueSheetService();

		const oldSheet: ISheet = sheetTemplate1;
		const oldSheetCreated = await sheetService.createSheet(oldSheet);

		const newSheet: ISheetWithID = {
			...oldSheetCreated,
			cloudiness: Cloudiness.Slightly,
			temperature: 15,
			tableItems: sheetTemplate1.tableItems.concat(sheetTemplate2.tableItems)
		};
		await sheetService.updateSheet(newSheet);

		const newSheetFetched = await sheetService.getSheet(newSheet.id);

		expect(newSheetFetched).toEqual(newSheet);
	});

	test('update meta data and replace whole table items', async () => {
		const sheetService = await makeUniqueSheetService();

		const oldSheet: ISheet = sheetTemplate1;
		const oldSheetCreated = await sheetService.createSheet(oldSheet);

		const newSheet: ISheetWithID = {
			...oldSheetCreated,
			precipitation: false,
			secretary: 'Some new dude',
			tableItems: sheetTemplate2.tableItems
		};
		await sheetService.updateSheet(newSheet);

		const newSheetFetched = await sheetService.getSheet(newSheet.id);

		expect(newSheetFetched).toEqual(newSheet);
	});
});

describe('delete sheet', () => {
	test('delete existing sheet', async () => {
		const sheetService = await makeUniqueSheetService();

		const createdSheet = await sheetService.createSheet(sheetTemplate1);

		await sheetService.deleteSheet(createdSheet.id);

		await expect(sheetService.getSheet(createdSheet.id))
			.rejects.toThrow(`Sheet with id ${createdSheet.id} not found in database`);
	});

	test('delete not-existing sheet', async () => {
		const sheetService = await makeUniqueSheetService();

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await sheetService.deleteSheet(notExistingID);
	});
});