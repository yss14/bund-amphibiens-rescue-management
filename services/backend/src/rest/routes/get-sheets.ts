import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";

export const makeGetSheetsRoute = (sheetService: SheetService): Express.RequestHandler => async (req, res) => {
	const sheets = await sheetService.getAllSheets();

	res.json(sheets);
}