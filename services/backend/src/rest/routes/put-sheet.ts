import * as Express from "express";
import { SheetService } from "../../services/sheet-service/SheetService";
import { CheckRequest } from "../check-request";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";
import { sheetSchema, sheetSchemaWithID } from "../sheet-schema";
import { CheckerSuccess } from "../../utils/checker";

export const makePutSheetRoute = (sheetService: SheetService) =>
	CheckRequest(sheetSchema)(async (req: CheckerSuccess<typeof sheetSchemaWithID>, res: Express.Response) => {
		await sheetService.updateSheet(req.body);

		res.status(HTTPStatusCode.NO_CONTENT).end();
	});