import * as constants from '../sheets.constants';
import { ISheetWithID } from '../../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../../store.schema';

export interface ISheetSaved {
	type: constants.SHEET_SAVED;
	payload: ISheetWithID;
}

export type SheetSaveAction = ISheetSaved;

const sheetSaved = (sheet: ISheetWithID): ISheetSaved => ({
	type: constants.SHEET_SAVED,
	payload: sheet
});

export const saveSheet = (api: ISheetsAPI, sheet: ISheetWithID) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetSaveAction>) => {
		try {
			await api.updateSheet(sheet);

			dispatch(sheetSaved(sheet));

			return sheet;
		} catch (err) {
			console.error(err);

			return Promise.reject(err);
		}
	}