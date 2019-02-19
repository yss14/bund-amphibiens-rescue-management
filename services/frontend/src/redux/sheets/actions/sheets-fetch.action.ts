import * as constants from '../sheets.constants';
import { ISheetWithID } from '../../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../../store.schema';
import { SheetsAction } from '../sheets.actions';

export interface ISharesFetched {
	type: constants.SHEETS_FETCHED;
	payload: ISheetWithID[];
}

export type SheetsFetchActions = ISharesFetched;

export const fetchShares = (api: ISheetsAPI) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, SheetsAction>) => {
		try {
			const sheets = await api.getSheets();

			dispatch({
				type: constants.SHEETS_FETCHED,
				payload: sheets
			});

			return Promise.resolve();
		} catch (err) {
			console.log(err);

			return Promise.reject();
		}
	}