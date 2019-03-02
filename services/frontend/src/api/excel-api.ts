import { groupBy } from 'lodash';
import moment from 'moment';
import { ISheetWithID } from '../../../shared-types/ISheet';
import { Cloudiness } from '../types/Cloudiness';
import { ISheetsAPI } from './sheets-api';
import { saveAs } from 'file-saver';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const sortByDateAsc = (lhs: ISheetWithID, rhs: ISheetWithID) =>
	moment(lhs.dateOfRecord).valueOf() - moment(rhs.dateOfRecord).valueOf();
const sortNumbersAsc = (lhs: number, rhs: number) => lhs - rhs;

const getUniqueAmphibiensKinds = (entries: ISheetWithID[]) => {
	const uniqueKinds = new Set<string>();

	entries.forEach(entry => entry.tableItems.forEach(item => uniqueKinds.add(item.amphibiansKind)));

	return Array.from(uniqueKinds.values());
}

const getUniqueBucketNumbers = (entries: ISheetWithID[]) => {
	const uniqueBucketNumbers = new Set<number>();

	entries.forEach(entry => entry.tableItems.forEach(item => uniqueBucketNumbers.add(item.bucketNumber)));

	return Array.from(uniqueBucketNumbers.values());
}

const getNumberOfCols = (amphibiensKindsCount: number) => {
	const metaDataCount = 6; // date,name,temperature,cloudiness,precipitation,bucketnumber,

	return amphibiensKindsCount + metaDataCount;
}

const getNumberOfRowsPerEntry = (bucketNumbersCount: number) => {
	const marginBottom = 2;

	return bucketNumbersCount + marginBottom + 1; // +1 for sum row
}

const mapCloudinessToLabel = (cloudiness: Cloudiness) => {
	switch (cloudiness) {
		case Cloudiness.Heavy: return 'Stark';
		case Cloudiness.NoClouds: return 'Keine';
		case Cloudiness.Slightly: return 'Leicht';
		default: return 'Keine Angabe';
	}
}

const createHeader = (data: any[][], amphibiensKinds: string[]) => {
	data[0][0] = 'Datum/Uhrzeit';
	data[0][1] = 'Name';
	data[0][2] = 'Temperatur';
	data[0][3] = 'Bewölkung';
	data[0][4] = 'Niederschlag';
	data[0][5] = 'Eimer';

	for (let i = 0; i < amphibiensKinds.length; i++) {
		data[0][i + 6] = amphibiensKinds[i];
	}

	data[0][6 + amphibiensKinds.length] = '∑';
}

const makeCreateExcelWorkbook = async () => {
	const xlsx = await import(/* webpackChunkName: "xlsx" */ 'xlsx');

	return (entries: ISheetWithID[], year: number) => {
		entries.sort(sortByDateAsc);

		const uniqueBucketNumbers = getUniqueBucketNumbers(entries).sort(sortNumbersAsc);
		const uniqueAmphibiensKinds = getUniqueAmphibiensKinds(entries);

		const numberOfCols = getNumberOfCols(uniqueAmphibiensKinds.length);
		const numberOfRowsPerEntry = getNumberOfRowsPerEntry(uniqueBucketNumbers.length);
		const numberOfRows = numberOfRowsPerEntry * entries.length + 1 + 10; // +1 for title row +10 buffer at the bottom

		const data = new Array(numberOfRows).fill(undefined).map(() => new Array(numberOfCols).fill({}));

		createHeader(data, uniqueAmphibiensKinds);

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];

			const rowOffset = 1 + i * numberOfRowsPerEntry;

			data[rowOffset][0] = { v: moment(entry.dateOfRecord).format(), t: 'd' };
			data[rowOffset][1] = entry.secretary;
			data[rowOffset][2] = { v: entry.temperature, t: 'n' };
			data[rowOffset][3] = mapCloudinessToLabel(entry.cloudiness);
			data[rowOffset][4] = { v: entry.precipitation ? 'Ja' : 'Nein', t: 's' };

			for (let j = 0; j < uniqueBucketNumbers.length; j++) {
				data[rowOffset + j][5] = uniqueBucketNumbers[j];

				const cellLeft = ALPHABET[6] + (rowOffset + j + 1);
				const cellRight = ALPHABET[6 + uniqueAmphibiensKinds.length - 1] + (rowOffset + j + 1);
				const formular = `=SUM(${cellLeft}:${cellRight})`;
				data[rowOffset + j][6 + uniqueAmphibiensKinds.length] = { f: formular }
			}

			data[rowOffset + uniqueBucketNumbers.length][5] = '∑';

			for (let j = 0; j <= uniqueAmphibiensKinds.length; j++) {
				const cellTop = ALPHABET[6 + j] + (rowOffset + 1);
				const cellBottom = ALPHABET[6 + j] + (rowOffset + uniqueBucketNumbers.length);
				const formular = `=SUM(${cellTop}:${cellBottom})`;
				data[rowOffset + uniqueBucketNumbers.length][6 + j] = { f: formular };
			}

			const dataByBucket = groupBy(entry.tableItems, 'bucketNumber');

			for (const [bucketNumber, items] of Object.entries(dataByBucket)) {
				const bucketOffset = uniqueBucketNumbers.indexOf(parseInt(bucketNumber));

				for (let j = 0; j < uniqueAmphibiensKinds.length; j++) {
					const item = items.find(item => item.amphibiansKind === uniqueAmphibiensKinds[j]);

					if (item) {
						data[rowOffset + bucketOffset][6 + j] = item.amount;
					} else {
						data[rowOffset + bucketOffset][6 + j] = 0;
					}
				}
			}

			for (let j = 0; j <= uniqueAmphibiensKinds.length; j++) {
				const cellTop = ALPHABET[6 + j] + 2;
				const cellBottom = ALPHABET[6 + j] + (entries.length * numberOfRowsPerEntry + 3);
				const formular = `=SUM(${cellTop}:${cellBottom})`;
				data[entries.length * numberOfRowsPerEntry + 4][6 + j] = { f: formular };
			}
		}

		const wb = xlsx.utils.book_new();
		const ws = xlsx.utils.aoa_to_sheet(data);
		xlsx.utils.book_append_sheet(wb, ws, 'Zählung ' + year);

		return wb;
	}
}

const stringToArrayBuffer = (binaryString: string) => {
	const buf = new ArrayBuffer(binaryString.length);
	const view = new Uint8Array(buf);

	for (let i = 0; i < binaryString.length; i++) {
		view[i] = binaryString.charCodeAt(i) & 0xFF;
	}

	return buf;
}

export const makeExportForYearAsExcel = async () => {
	const xlsx = await import(/* webpackChunkName: "xlsx" */ 'xlsx');
	const createExcelWorkbook = await makeCreateExcelWorkbook();

	return async (api: ISheetsAPI, year: number) => {
		const entries = (await api.getSheets())
			.filter(entry => moment(entry.dateOfRecord).year() === year);

		const workbook = createExcelWorkbook(entries, year);
		const workbookBinary = xlsx.write(workbook, { bookType: 'xlsx', type: 'binary' });

		saveAs(
			new Blob(
				[stringToArrayBuffer(workbookBinary)],
				{ type: "application/octet-stream" }
			),
			`Amphibienzählung_${year}.xlsx`
		);
	}
}
