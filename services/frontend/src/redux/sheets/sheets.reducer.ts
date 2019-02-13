import { ISheetsSchema } from "./sheets.schema";
import { SheetsAction } from "./sheets.actions";
import * as constants from './sheets.constants';

const defaultState: ISheetsSchema = {
	data: [],
	isFetching: false
}

export const sheetsReducer = (state: ISheetsSchema = defaultState, action: SheetsAction): ISheetsSchema => {
	switch (action.type) {
		case constants.SHEETS_FETCHING:
			return { ...state, isFetching: true };

		case constants.SHEETS_FETCH_FAILED:
			return { ...state, isFetching: false };

		case constants.SHEETS_FETCHED:
			return { ...state, isFetching: false, data: action.payload };

		default: return state;
	}
}