import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";

export const makeGetSheetRoute = (sheetService: SheetService): Express.RequestHandler => async (req, res) => {
	const sheetID = req.params.sheetID;

	const sheet = await sheetService.getSheet(sheetID);

	res.json(sheet);
}