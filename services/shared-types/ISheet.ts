export enum Cloudiness {
	NoClouds = 'no_clouds',
	Slightly = 'slightly',
	Heavy = 'heavy'
}

export interface ISheetTableItem {
	bucketNumber: number;
	amphibiansKind: string;
	amount: number;
}

export interface ISheet {
	dateOfRecord: Date;
	secretary: string;
	temperature: number;
	cloudiness: Cloudiness;
	precipitation: boolean;
	tableItems: ISheetTableItem[];
}

export interface ISheetWithID extends ISheet {
	id: string;
}

export const isSheetWithID = (sheet: any): sheet is ISheetWithID => {
	return (<ISheetWithID>sheet).id !== undefined && sheet._id !== null;
}