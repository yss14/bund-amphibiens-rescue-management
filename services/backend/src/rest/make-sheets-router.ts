import * as Express from "express";
import { SheetService } from "../services/sheet-service/SheetService";
import { makeGetSheetsRoute } from "./routes/get-sheets";
import { makeGetSheetRoute } from "./routes/get-sheet";
import { makePostSheetRoute } from "./routes/post-sheet";
import { makeDeleteSheetRoute } from "./routes/delete-sheet";
import { makePutSheetRoute } from "./routes/put-sheet";
import { __PROD__ } from "../utils/env/env-constants";

export const makeSheetsRouter = (expressApp: Express.Application, sheetService: SheetService, authMiddleware?: Express.RequestHandler) => {
	/* istanbul ignore next */
	if (__PROD__ && authMiddleware === undefined) {
		console.warn(`Sheets routes are not protected by an authentication mechanism`);
	}

	const router = Express.Router();

	if (authMiddleware) {
		router.use(authMiddleware);
	}

	router.get('/', makeGetSheetsRoute(sheetService));
	router.get('/:sheetID', makeGetSheetRoute(sheetService));
	router.post('/', makePostSheetRoute(sheetService));
	router.put('/:sheetID', makePutSheetRoute(sheetService));
	router.delete('/:sheetID', makeDeleteSheetRoute(sheetService));

	expressApp.use('/sheets', router)
}