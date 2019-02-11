import { ISheet, ISheetWithID } from "../../../../shared-types/ISheet";

export interface ISheetService {
	getSheet(id: string): Promise<ISheetWithID>;
	getAllSheets(): Promise<ISheetWithID[]>;

	createSheet(sheet: ISheet): Promise<ISheetWithID>;
	updateSheet(sheet: ISheetWithID): Promise<void>;
}