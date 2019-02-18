import { ISheetTableItem, ISheet } from "../../../shared-types/ISheet";

const makeSheetTable = (bucketNumbers: number[], amphibiensLabels: string[]): ISheetTableItem[] => {
	const tableItems: ISheetTableItem[] = [];

	for (const bucketNumber of bucketNumbers) {
		for (const amphibiensLabel of amphibiensLabels) {
			tableItems.push({
				amphibiansKind: amphibiensLabel,
				bucketNumber: bucketNumber,
				amount: 0
			});
		}
	}

	return tableItems;
}

export const makeEmptySheet = (bucketNumbers: number[], amphibiensLabels: string[], secretary: string): ISheet => {
	const sheet: ISheet = {
		cloudiness: 'no_clouds' as any,
		dateOfRecord: new Date(),
		precipitation: false,
		secretary: secretary,
		temperature: 10,
		tableItems: makeSheetTable(bucketNumbers, amphibiensLabels)
	}

	return sheet;
}

export const makeBucketNumbers = (start: number, end: number, exceptions: number[]): number[] => {
	const bucketNumbers: number[] = [];

	for (let i = start; i <= end; i++) {
		if (!exceptions.includes(i)) {
			bucketNumbers.push(i);
		}
	}

	return bucketNumbers;
}