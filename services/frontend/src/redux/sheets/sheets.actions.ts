import * as constants from './sheets.constants';
import { ISheetWithID } from '../../../../shared-types/ISheet';
import { ISheetsAPI } from '../../api/sheets-api';
import { ThunkDispatch } from 'redux-thunk';
import { IStoreSchema } from '../store.schema';

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
		} catch (err) {
			console.log(err);

			dispatch({
				type: constants.SHEETS_FETCH_FAILED,
				payload: err
			});
		}
	}

export type SheetsAction = ISharesFetched | ISharesFetching | ISharesFetchFailed;