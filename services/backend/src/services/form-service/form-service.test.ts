import { FormService } from "./FormService";
import { makeAndConnectDatabase } from "../../database/make-database";
import { MongoClient } from "mongodb";
import { IForm, Cloudiness, IFormWithID } from "../../../../shared-types/IForm";
import { v4 as uuid } from 'uuid';

const databaseConnections: MongoClient[] = [];

const makeUniqueFormService = async () => {
	const randomDBName = uuid().split('-').join('');
	const { database, connection } = await makeAndConnectDatabase(randomDBName);
	const formService = new FormService(database);

	databaseConnections.push(connection);

	return formService;
}

const formTemplate1: IForm = {
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

const formTemplate2: IForm = {
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

describe('get form', async () => {
	test('get existing form', async () => {
		const formService = await makeUniqueFormService();

		const createdForm = await formService.createForm(formTemplate1);

		const fetchedForm = await formService.getForm(createdForm.id);

		expect(fetchedForm).toEqual(createdForm);
	});

	test('get not-existing form', async () => {
		const formService = await makeUniqueFormService();

		const notExistingID = '5c6082cea068a184fc11aaaa';

		await expect(formService.getForm(notExistingID))
			.rejects.toThrow(`Form with id ${notExistingID} not found in database`);
	});

	test('get form by invalid id', async () => {
		const formService = await makeUniqueFormService();

		await expect(formService.getForm('invalidid'))
			.rejects.toThrow('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	});
});

describe('get forms', () => {
	test('get forms of empty database', async () => {
		const formService = await makeUniqueFormService();

		const forms = await formService.getAllForms();

		expect(forms).toEqual([]);
	});

	test('get forms', async () => {
		const formService = await makeUniqueFormService();

		const createdForm1 = await formService.createForm(formTemplate1);
		const createdForm2 = await formService.createForm(formTemplate2);

		const forms = await formService.getAllForms();

		expect(forms).toEqual([
			createdForm1,
			createdForm2
		]);
	});
});

describe('update form', () => {
	test('update meta data and add new table items', async () => {
		const formService = await makeUniqueFormService();

		const oldForm: IForm = formTemplate1;
		const oldFormCreated = await formService.createForm(oldForm);

		const newForm: IFormWithID = {
			...oldFormCreated,
			cloudiness: Cloudiness.Slightly,
			temperature: 15,
			tableItems: formTemplate1.tableItems.concat(formTemplate2.tableItems)
		};
		await formService.updateForm(newForm);

		const newFormFetched = await formService.getForm(newForm.id);

		expect(newFormFetched).toEqual(newForm);
	});

	test('update meta data and replace whole table items', async () => {
		const formService = await makeUniqueFormService();

		const oldForm: IForm = formTemplate1;
		const oldFormCreated = await formService.createForm(oldForm);

		const newForm: IFormWithID = {
			...oldFormCreated,
			precipitation: false,
			secretary: 'Some new dude',
			tableItems: formTemplate2.tableItems
		};
		await formService.updateForm(newForm);

		const newFormFetched = await formService.getForm(newForm.id);

		expect(newFormFetched).toEqual(newForm);
	});
});