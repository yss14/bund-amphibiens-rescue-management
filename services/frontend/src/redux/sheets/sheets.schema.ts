import { ISheetWithID } from '../../../../shared-types/ISheet';

export interface ISheetsSchema {
	data: ISheetWithID[];
	selectedSheet: ISheetWithID | null;
}