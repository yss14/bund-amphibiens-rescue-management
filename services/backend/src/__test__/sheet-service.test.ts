import { ISheet, Cloudiness, ISheetWithID } from "../../../shared-types/ISheet";
import { sheetTemplate1, sheetTemplate2 } from "./utils/sheet-templates";
import { makeUniqueTestSheetService } from "./utils/make-test-sheet-service";

describe('get sheet', async () => {
	test('get existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		const createdSheet = await sheetService.createSheet(sheetTemplate1);

		const fetchedSheet = await sheetService.getSheet(createdSheet.id);

		expect(fetchedSheet).toEqual(createdSheet);

		await cleanup();
	});

	test('get not-existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await expect(sheetService.getSheet(notExistingID))
			.rejects.toThrow(`Sheet with id ${notExistingID} not found in database`);

		await cleanup();
	});

	test('get sheet by invalid id', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		await expect(sheetService.getSheet('invalidid'))
			.rejects.toThrow('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');

		await cleanup();
	});
});

describe('get sheets', () => {
	test('get sheets of empty database', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		const sheets = await sheetService.getAllSheets();

		expect(sheets).toEqual([]);

		await cleanup();
	});

	test('get sheets', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		const createdSheet1 = await sheetService.createSheet(sheetTemplate1);
		const createdSheet2 = await sheetService.createSheet(sheetTemplate2);

		const sheets = await sheetService.getAllSheets();

		expect(sheets).toEqual([
			createdSheet1,
			createdSheet2
		]);

		await cleanup();
	});
});

describe('update sheet', () => {
	test('update meta data and add new table items', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

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

		await cleanup();
	});

	test('update meta data and replace whole table items', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

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

		await cleanup();
	});
});

describe('delete sheet', () => {
	test('delete existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		const createdSheet = await sheetService.createSheet(sheetTemplate1);

		await sheetService.deleteSheet(createdSheet.id);

		await expect(sheetService.getSheet(createdSheet.id))
			.rejects.toThrow(`Sheet with id ${createdSheet.id} not found in database`);

		await cleanup();
	});

	test('delete not-existing sheet', async () => {
		const { sheetService, cleanup } = await makeUniqueTestSheetService();

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await sheetService.deleteSheet(notExistingID);

		await cleanup();
	});
});