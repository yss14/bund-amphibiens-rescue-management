import { ISheet, Cloudiness } from "../../../../shared-types/ISheet";

export const sheetTemplate1: ISheet = {
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

export const sheetTemplate2: ISheet = {
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