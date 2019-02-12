import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";

export const makeDeleteSheetRoute = (sheetService: SheetService): Express.RequestHandler => async (req, res) => {
	const sheetID = req.params.sheetID;

	await sheetService.deleteSheet(sheetID);

	res.status(HTTPStatusCode.NO_CONTENT).end();
}