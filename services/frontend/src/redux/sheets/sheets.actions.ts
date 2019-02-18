import * as constants from './sheets.constants';
import { ISheetWithID } from '../../../../shared-types/ISheet';
import { SheetSaveAction } from './actions/sheet-save.action';
import { SheetCreateAction } from './actions/sheet-create.action';
import { SheetsFetchActions } from './actions/sheets-fetch.action';

export interface ISheetSelect {
	type: constants.SHEET_SELECT;
	payload: ISheetWithID;
}

export const selectSheet = (sheet: ISheetWithID): ISheetSelect => ({
	type: constants.SHEET_SELECT,
	payload: sheet
})

export type SheetsAction = SheetsFetchActions | SheetSaveAction | SheetCreateAction | ISheetSelect;