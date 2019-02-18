import * as constants from '../sheets.constants';
import { ISheetWithID } from '../../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../../store.schema';

export interface ISheetSaving {
	type: constants.SHEET_SAVING;
	payload: boolean;
}

export interface ISheetSaved {
	type: constants.SHEET_SAVED;
	payload: ISheetWithID;
}

export interface ISheetSaveFailed {
	type: constants.SHEET_SAVE_FAILED;
	payload: Error;
}

export type SheetSaveAction = ISheetSaving | ISheetSaved | ISheetSaveFailed;

const savingSheet = (): ISheetSaving => ({
	type: constants.SHEET_SAVING,
	payload: true
});

const sheetSaved = (sheet: ISheetWithID): ISheetSaved => ({
	type: constants.SHEET_SAVED,
	payload: sheet
});

const sheetSavedFailed = (err: Error): ISheetSaveFailed => ({
	type: constants.SHEET_SAVE_FAILED,
	payload: err
});

export const saveSheet = (api: ISheetsAPI, sheet: ISheetWithID) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetSaveAction>) => {
		try {
			dispatch(savingSheet());

			await api.updateSheet(sheet);

			dispatch(sheetSaved(sheet));

			return sheet;
		} catch (err) {
			console.error(err);

			dispatch(sheetSavedFailed(err));

			return Promise.reject(err);
		}
	}