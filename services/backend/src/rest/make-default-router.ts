import * as Express from "express";
import { SheetService } from "../services/sheet-service/SheetService";

export const makeDefaultRouter = (sheetService: SheetService) => {
	const router = Express.Router();

	router.get('/sheets');
	router.get('/sheets/:sheetID');
	router.post('/sheets');
	router.put('/sheets');
	router.delete('/sheets/:sheetID');

	return router;
}