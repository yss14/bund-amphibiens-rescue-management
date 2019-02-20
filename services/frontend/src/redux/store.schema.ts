import { ISheetsSchema } from "./sheets/sheets.schema";
import { IUserSchema } from "./user/user.schema";

export interface IStoreSchema {
	sheets: ISheetsSchema;
	user: IUserSchema;
}