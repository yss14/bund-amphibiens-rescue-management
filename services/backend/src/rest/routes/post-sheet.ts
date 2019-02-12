import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";
import { CheckRequest, CheckedExpressRequest } from "../check-request";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";
import { sheetSchema } from "../sheet-schema";

export const makePostSheetRoute = (sheetService: SheetService) =>
	CheckRequest(sheetSchema)(async (req: CheckedExpressRequest<typeof sheetSchema>, res: Express.Response) => {
		const createdSheet = await sheetService.createSheet(req.body);

		res.status(HTTPStatusCode.CREATED).json(createdSheet);
	});