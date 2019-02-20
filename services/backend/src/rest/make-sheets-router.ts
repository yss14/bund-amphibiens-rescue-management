import * as Express from "express";
import { SheetService } from "../services/sheet-service/SheetService";
import { makeGetSheetsRoute } from "./routes/get-sheets";
import { makeGetSheetRoute } from "./routes/get-sheet";
import { makePostSheetRoute } from "./routes/post-sheet";
import { makeDeleteSheetRoute } from "./routes/delete-sheet";
import { makePutSheetRoute } from "./routes/put-sheet";
import { __PROD__ } from "../utils/env/env-constants";

export const makeSheetsRouter = (sheetService: SheetService, authMiddleware?: Express.RequestHandler) => {
	if (__PROD__ && authMiddleware === undefined) {
		console.warn(`Sheets routes are not protected by an authentication mechanism`);
	}

	const router = Express.Router();

	if (authMiddleware) {
		router.use(authMiddleware);
	}

	router.get('/sheets', makeGetSheetsRoute(sheetService));
	router.get('/sheets/:sheetID', makeGetSheetRoute(sheetService));
	router.post('/sheets', makePostSheetRoute(sheetService));
	router.put('/sheets/:sheetID', makePutSheetRoute(sheetService));
	router.delete('/sheets/:sheetID', makeDeleteSheetRoute(sheetService));

	return router;
}