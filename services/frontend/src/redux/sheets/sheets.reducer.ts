import { ISheetsSchema } from "./sheets.schema";
import { SheetsAction } from "./sheets.actions";
import * as constants from './sheets.constants';

const defaultState: ISheetsSchema = {
	data: [],
	selectedSheet: null
}

export const sheetsReducer = (state: ISheetsSchema = defaultState, action: SheetsAction): ISheetsSchema => {
	switch (action.type) {
		case constants.SHEETS_FETCHED:
			return { ...state, data: action.payload };

		case constants.SHEET_CREATED:
			return { ...state, data: state.data.concat(action.payload) };

		case constants.SHEET_SELECT:
			return { ...state, selectedSheet: action.payload };

		default: return state;
	}
}