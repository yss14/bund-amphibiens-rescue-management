import { ISheetService } from "./ISheetService";
import { Db, Collection, ObjectID } from "mongodb";
import { ISheetWithID, ISheet } from "../../../../shared-types/ISheet";

export class SheetNotFoundError extends Error {
	constructor(id: string) {
		super(`Sheet with id ${id} not found in database`);
	}
}

export class SheetModificationFailedError extends Error {
	constructor(operation: 'insert' | 'update') {
		/* istanbul ignore next */
		super(`Sheet could not be ${operation}ed`);
	}
}

interface ISheetDBResult extends ISheet {
	_id: ObjectID
}

export class SheetService implements ISheetService {
	private readonly dbCollection: Collection<ISheetDBResult>;

	constructor(database: Db) {
		this.dbCollection = database.collection<ISheetDBResult>('sheets');
	}

	public async getSheet(id: string): Promise<ISheetWithID> {
		const objectID = new ObjectID(id);
		const dbResult = await this.dbCollection.find({ _id: objectID }).toArray();

		if (dbResult.length > 0) {
			return this.makeSheetObjectFromDBResult(dbResult[0]);
		}

		throw new SheetNotFoundError(id);
	}

	public async getAllSheets(): Promise<ISheetWithID[]> {
		const dbResults = await this.dbCollection.find().toArray();

		return dbResults.map(this.makeSheetObjectFromDBResult);

	}

	public async createSheet(sheet: ISheet): Promise<ISheetWithID> {
		const dbResult = await this.dbCollection.insertOne(sheet as any);

		/* istanbul ignore else */
		if (dbResult.insertedCount === 1 && dbResult.insertedId) {
			return this.makeSheetObjectFromDBResult(sheet as ISheetDBResult); // mongo does some weird side effects
		} else {
			throw new SheetModificationFailedError('insert');
		}
	}

	public async updateSheet(sheet: ISheetWithID): Promise<void> {
		const { id, ...sheetWithoutID } = sheet;
		const objectID = new ObjectID(sheet.id);
		const dbResult = await this.dbCollection.updateOne(
			{ _id: objectID },
			{
				$set: {
					...sheetWithoutID
				}
			}
		);

		/* istanbul ignore if */
		if (dbResult.matchedCount !== 1) {
			throw new SheetModificationFailedError('update');
		}
	}

	public async deleteSheet(id: string): Promise<void> {
		const objectID = new ObjectID(id);

		const dbResult = await this.dbCollection.deleteOne({ _id: objectID });

		if (dbResult.deletedCount !== 1) {
			throw new SheetNotFoundError(id);
		}
	}

	private makeSheetObjectFromDBResult(sheetFromDB: ISheetDBResult): ISheetWithID {
		const { _id, ...sheetWithoutID } = sheetFromDB;

		return {
			...sheetWithoutID,
			id: sheetFromDB._id.toHexString()
		}
	}
}