import { ISheetsSchema } from "./sheets.schema";
import { SheetsActions } from "./sheets.actions";

const defaultState: ISheetsSchema = [];

export const sheetsReducer = (state: ISheetsSchema = defaultState, action: SheetsActions): ISheetsSchema => {
	return state;
}