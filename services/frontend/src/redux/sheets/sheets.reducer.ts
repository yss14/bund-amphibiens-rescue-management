import { ISheetsSchema } from "./sheets.schema";
import { SheetsAction } from "./sheets.actions";
import * as constants from './sheets.constants';

const defaultState: ISheetsSchema = {
	data: [],
	selectedSheet: null,
	isFetching: false,
	isSaving: false,
	isCreating: false
}

export const sheetsReducer = (state: ISheetsSchema = defaultState, action: SheetsAction): ISheetsSchema => {
	switch (action.type) {
		case constants.SHEETS_FETCHING:
			return { ...state, isFetching: true };

		case constants.SHEETS_FETCH_FAILED:
			return { ...state, isFetching: false };

		case constants.SHEETS_FETCHED:
			return { ...state, isFetching: false, data: action.payload };

		case constants.SHEET_SAVING:
			return { ...state, isSaving: true };

		case constants.SHEET_SAVED:
		case constants.SHEET_SAVE_FAILED:
			return { ...state, isSaving: false };

		case constants.SHEET_CREATING:
			return { ...state, isCreating: true };

		case constants.SHEET_CREATED:
			return { ...state, isCreating: false, data: state.data.concat(action.payload) };

		case constants.SHEET_CREATE_FAILED:
			return { ...state, isCreating: false };

		case constants.SHEET_SELECT:
			return { ...state, selectedSheet: action.payload };

		default: return state;
	}
}