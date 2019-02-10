import { IFormService } from "./IFormService";
import { Db, Collection, ObjectID } from "mongodb";
import { IFormWithID, IForm, isFormWithID } from "../../../../shared-types/IForm";

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

export class FormService implements IFormService {
	private readonly dbCollection: Collection<IForm>;

	constructor(database: Db) {
		this.dbCollection = database.collection<IForm>('forms');
	}

	public async getForm(id: string) {
		const objectID = new ObjectID(id);
		const dbResult = await this.dbCollection.find({ _id: objectID }).toArray();

		console.log(dbResult)

		if (dbResult.length > 0) {
			const formFromDB = dbResult[0];

			if (isFormWithID(formFromDB)) {
				return formFromDB;
			}
		}

		throw new FormNotFoundError(id);
	}

	public async getAllForms(): Promise<IFormWithID[]> {
		const dbResults = await this.dbCollection.find().toArray();

		return dbResults.filter(isFormWithID);

	}

	public async createForm(form: IForm) {
		const dbResult = await this.dbCollection.insertOne(form);

		if (dbResult.insertedCount === 1 && dbResult.insertedId) {
			return {
				...form,
				_id: dbResult.insertedId.toHexString()
			}
		} else {
			throw new FormModificationFailedError('insert');
		}
	}

	public async updateForm(form: IFormWithID): Promise<void> {
		const { _id, ...formWithoutID } = form;
		const objectID = new ObjectID(form._id);
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