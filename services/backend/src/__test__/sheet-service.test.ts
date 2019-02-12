import { ISheet, Cloudiness, ISheetWithID } from "../../../shared-types/ISheet";
import { sheetTemplate1, sheetTemplate2 } from "./utils/sheet-templates";
import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";

const cleanUpHooks: (() => Promise<void>)[] = [];

afterAll(async () => {
	await Promise.all(cleanUpHooks.map(hook => hook()));
});

describe('get sheet', async () => {
	test('get existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		const createdSheet = await sheetService.createSheet(sheetTemplate1);

		const fetchedSheet = await sheetService.getSheet(createdSheet.id);

		expect(fetchedSheet).toEqual(createdSheet);
		expect(fetchedSheet).not.toHaveProperty('_id');
	});

	test('get not-existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await expect(sheetService.getSheet(notExistingID))
			.rejects.toThrow(`Sheet with id ${notExistingID} not found in database`);
	});

	test('get sheet by invalid id', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		await expect(sheetService.getSheet('invalidid'))
			.rejects.toThrow('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	});
});

describe('get sheets', () => {
	test('get sheets of empty database', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		const sheets = await sheetService.getAllSheets();

		expect(sheets).toEqual([]);
	});

	test('get sheets', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		const createdSheet1 = await sheetService.createSheet(sheetTemplate1);
		const createdSheet2 = await sheetService.createSheet(sheetTemplate2);

		const sheets = await sheetService.getAllSheets();

		expect(sheets).toEqual([
			createdSheet1,
			createdSheet2
		]);
		expect(sheets[0]).not.toHaveProperty('_id');
		expect(sheets[1]).not.toHaveProperty('_id');
	});
});

describe('update sheet', () => {
	test('update meta data and add new table items', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

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
		expect(newSheetFetched).not.toHaveProperty('_id');
	});

	test('update meta data and replace whole table items', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

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
		expect(newSheetFetched).not.toHaveProperty('_id');
	});
});

describe('delete sheet', () => {
	test('delete existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		const createdSheet = await sheetService.createSheet(sheetTemplate1);

		await sheetService.deleteSheet(createdSheet.id);

		await expect(sheetService.getSheet(createdSheet.id))
			.rejects.toThrow(`Sheet with id ${createdSheet.id} not found in database`);
	});

	test('delete not-existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();
		cleanUpHooks.push(cleanup);

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await expect(sheetService.deleteSheet(notExistingID))
			.rejects.toThrow(`Sheet with id ${notExistingID} not found in database`);
	});
});