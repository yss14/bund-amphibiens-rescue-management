import * as constants from './sheets.constants';
import { ISheetWithID, ISheet } from '../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../store.schema';
import { isSheetWithID } from '../../typeguards/is-sheet';

export interface ISharesFetching {
	type: typeof constants.SHEETS_FETCHING;
	payload: boolean;
}

export interface ISharesFetched {
	type: constants.SHEETS_FETCHED;
	payload: ISheetWithID[];
}

export interface ISharesFetchFailed {
	type: constants.SHEETS_FETCH_FAILED;
	payload: Error;
}

export const fetchShares = (api: ISheetsAPI) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetsAction>) => {
		try {
			dispatch({
				type: constants.SHEETS_FETCHING,
				payload: true
			});

			const sheets = await api.getSheets();

			dispatch({
				type: constants.SHEETS_FETCHED,
				payload: sheets
			});

			return Promise.resolve();
		} catch (err) {
			console.log(err);

			dispatch({
				type: constants.SHEETS_FETCH_FAILED,
				payload: err
			});

			return Promise.reject();
		}
	}

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

export const saveSheet = (api: ISheetsAPI, sheet: ISheet | ISheetWithID) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetSaveAction>) => {
		try {
			dispatch({
				type: constants.SHEET_SAVING,
				payload: true
			});

			let sheetWithID: ISheetWithID;

			if (isSheetWithID(sheet)) {
				await api.updateSheet(sheet);

				sheetWithID = sheet;
			} else {
				sheetWithID = await api.createSheet(sheet);
			}

			dispatch({
				type: constants.SHEET_SAVED,
				payload: sheetWithID
			});

			return sheetWithID;
		} catch (err) {
			console.error(err);

			dispatch({
				type: constants.SHEET_SAVE_FAILED,
				payload: err
			});

			return Promise.reject(err);
		}
	}

export interface ISheetSelect {
	type: constants.SHEET_SELECT;
	payload: ISheetWithID;
}

export const selectSheet = (sheet: ISheetWithID): ISheetSelect => ({
	type: constants.SHEET_SELECT,
	payload: sheet
})

export type SheetsAction = ISharesFetched | ISharesFetching | ISharesFetchFailed | SheetSaveAction | ISheetSelect;