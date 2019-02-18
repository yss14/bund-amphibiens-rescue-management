import { SheetService } from "../services/sheet-service/SheetService";
import { sheetTemplate1 } from "../__test__/utils/sheet-templates";
import { ISheet } from "../../../shared-types/ISheet";
import * as faker from 'faker';
import moment = require("moment");

export const seedDatabase = async (sheetService: SheetService) => {
	const existingSheets = await sheetService.getAllSheets();
	const remainingInsertCount = 50 - existingSheets.length;

	if (remainingInsertCount > 0) {
		await Promise.all(new Array(remainingInsertCount).fill(undefined).map((_, idx) => {
			const sheet: ISheet = {
				...sheetTemplate1,
				secretary: faker.name.firstName() + ' ' + faker.name.lastName(),
				precipitation: Math.random() > 0.5,
				temperature: Math.floor(Math.random() * 40) - 10,
				dateOfRecord: moment().subtract(idx + 2, 'days').toDate()
			}

			return sheetService.createSheet(sheet);
		}));
	}
}