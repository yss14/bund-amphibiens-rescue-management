import { ISheet, ISheetWithID } from "../../../shared-types/ISheet";

export const isSheet = (obj: any): obj is ISheet => {
	return obj.dateOfRecord !== undefined && obj.secretary !== undefined && obj.temperature !== undefined
		&& obj.cloudiness !== undefined && obj.precipitation !== undefined && obj.tableItems !== undefined;
}

export const isSheetWithID = (obj: any): obj is ISheetWithID => {
	return obj.id !== undefined && isSheet(obj);
}