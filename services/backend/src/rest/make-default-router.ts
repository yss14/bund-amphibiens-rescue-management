import * as Express from "express";
import { SheetService } from "../services/sheet-service/SheetService";
import { makeGetSheetsRoute } from "./routes/get-sheets";
import { makeGetSheetRoute } from "./routes/get-sheet";
import { makePostSheetRoute } from "./routes/post-sheet";
import { makeDeleteSheetRoute } from "./routes/delete-sheet";

export const makeDefaultRouter = (sheetService: SheetService) => {
	const router = Express.Router();

	router.get('/sheets', makeGetSheetsRoute(sheetService));
	router.get('/sheets/:sheetID', makeGetSheetRoute(sheetService));
	router.post('/sheets', makePostSheetRoute(sheetService));
	//router.put('/sheets');
	router.delete('/sheets/:sheetID', makeDeleteSheetRoute(sheetService));

	return router;
}