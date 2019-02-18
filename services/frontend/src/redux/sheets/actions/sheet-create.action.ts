import * as constants from '../sheets.constants';
import { ISheetWithID, ISheet } from '../../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../../store.schema';

export interface ISheetCreating {
	type: constants.SHEET_CREATING;
	payload: boolean;
}

export interface ISheetCreated {
	type: constants.SHEET_CREATED;
	payload: ISheetWithID;
}

export interface ISheetCreateFailed {
	type: constants.SHEET_CREATE_FAILED;
	payload: Error;
}

export type SheetCreateAction = ISheetCreating | ISheetCreated | ISheetCreateFailed;

export const creatingSheet = (): ISheetCreating => ({
	type: constants.SHEET_CREATING,
	payload: true
})

export const sheetCreated = (sheet: ISheetWithID): ISheetCreated => ({
	type: constants.SHEET_CREATED,
	payload: sheet
})

export const sheetCreatedFailed = (err: Error): ISheetCreateFailed => ({
	type: constants.SHEET_CREATE_FAILED,
	payload: err
})

export const createSheet = (api: ISheetsAPI, sheet: ISheet) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetCreateAction>) => {
		try {
			dispatch(creatingSheet());

			const sheetWithID = await api.createSheet(sheet);

			dispatch(sheetCreated(sheetWithID));

			return sheetWithID;
		} catch (err) {
			console.error(err);

			dispatch(sheetCreatedFailed(err));

			return Promise.reject(err);
		}
	}