import { IFormService } from "./IFormService";
import { Db, Collection, ObjectID } from "mongodb";
import { IFormWithID, IForm } from "../../../../shared-types/IForm";

export class FormNotFoundError extends Error {
	constructor(id: string) {
		super(`Form with id ${id} not found in database`);
	}
}

export class FormModificationFailedError extends Error {
	constructor(operation: 'insert' | 'update') {
		super(`Form could not be ${operation}ed`);
	}
}

interface IFormDBResult extends IForm {
	_id: ObjectID
}

export class FormService implements IFormService {
	private readonly dbCollection: Collection<IFormDBResult>;

	constructor(database: Db) {
		this.dbCollection = database.collection<IFormDBResult>('forms');
	}

	public async getForm(id: string): Promise<IFormWithID> {
		const objectID = new ObjectID(id);
		const dbResult = await this.dbCollection.find({ _id: objectID }).toArray();

		if (dbResult.length > 0) {
			const formFromDB = dbResult[0];

			return { ...formFromDB, id: formFromDB._id.toHexString() };
		}

		throw new FormNotFoundError(id);
	}

	public async getAllForms(): Promise<IFormWithID[]> {
		const dbResults = await this.dbCollection.find().toArray();

		return dbResults.map(dbResult => ({ ...dbResult, id: dbResult._id.toHexString() }));

	}

	public async createForm(form: IForm): Promise<IFormWithID> {
		const dbResult = await this.dbCollection.insertOne(form as any);

		if (dbResult.insertedCount === 1 && dbResult.insertedId) {
			return {
				...form,
				id: dbResult.insertedId.toHexString()
			}
		} else {
			throw new FormModificationFailedError('insert');
		}
	}

	public async updateForm(form: IFormWithID): Promise<void> {
		const { id, ...formWithoutID } = form;
		const objectID = new ObjectID(form.id);
		const dbResult = await this.dbCollection.updateOne(
			{ _id: objectID },
			{
				$set: {
					...formWithoutID
				}
			}
		);

		if (dbResult.modifiedCount !== 1) {
			throw new FormModificationFailedError('update');
		}
	}
}