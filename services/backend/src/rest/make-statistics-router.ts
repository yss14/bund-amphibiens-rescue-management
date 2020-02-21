import * as Express from "express";
import { SheetService } from "../services/sheet-service/SheetService";
import { makeGetStatisticRoute } from "./routes/get-statistic"

export const makeStatisticsRouter = (expressApp: Express.Application, sheetService: SheetService) => {
	const router = Express.Router();

	router.get('/', makeGetStatisticRoute(sheetService));

	expressApp.use('/statistic', router)
}