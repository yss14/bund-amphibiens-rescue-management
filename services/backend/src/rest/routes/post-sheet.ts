import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";
import { CheckRequest } from "../check-request";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";
import { sheetSchema } from "../sheet-schema";
import { CheckerSuccess } from "../../utils/checker";

export const makePostSheetRoute = (sheetService: SheetService) =>
	CheckRequest(sheetSchema)(async (req: CheckerSuccess<typeof sheetSchema>, res: Express.Response) => {
		const createdSheet = await sheetService.createSheet(req.body);

		res.status(HTTPStatusCode.CREATED).json(createdSheet);
	});