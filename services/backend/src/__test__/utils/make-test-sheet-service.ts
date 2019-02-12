import { makeAndConnectDatabase } from "../../database/make-database";
import { SheetService } from "../../services/sheet-service/SheetService";
import { v4 as uuid } from 'uuid';

export const makeUniqueTestSheetService = async () => {
	const randomDBName = uuid().split('-').join('');
	const { database, connection } = await makeAndConnectDatabase(randomDBName);
	const sheetService = new SheetService(database);

	const cleanupHook = async () => {
		await database.dropDatabase();
		await connection.close();
	};

	return { sheetService, cleanup: cleanupHook };
}