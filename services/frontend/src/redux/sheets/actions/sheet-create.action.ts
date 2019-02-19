import * as constants from '../sheets.constants';
import { ISheetWithID, ISheet } from '../../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../../store.schema';

export interface ISheetCreated {
	type: constants.SHEET_CREATED;
	payload: ISheetWithID;
}

export type SheetCreateAction = ISheetCreated;

export const sheetCreated = (sheet: ISheetWithID): ISheetCreated => ({
	type: constants.SHEET_CREATED,
	payload: sheet
})

export const createSheet = (api: ISheetsAPI, sheet: ISheet) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetCreateAction>) => {
		try {
			const sheetWithID = await api.createSheet(sheet);

			dispatch(sheetCreated(sheetWithID));

			return sheetWithID;
		} catch (err) {
			console.error(err);

			return Promise.reject(err);
		}
	}