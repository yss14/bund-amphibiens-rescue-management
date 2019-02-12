import { Keys, TypeString, TypeNumber, TypeBoolean, TypeEnumString, Items, TypeCheck } from "../utils/checker";
import { ISheet, Cloudiness, ISheetTableItem, ISheetWithID } from "../../../shared-types/ISheet";
import * as moment from 'moment';

export const sheetTableItemSchema = Keys<ISheetTableItem>({
	amount: TypeNumber,
	amphibiansKind: TypeString,
	bucketNumber: TypeNumber
});

const sharedSheetSchema = {
	dateOfRecord: TypeCheck((value: any): value is Date => moment(value).isValid()),
	secretary: TypeString,
	temperature: TypeNumber,
	cloudiness: TypeEnumString(Cloudiness),
	precipitation: TypeBoolean,
	tableItems: Items(sheetTableItemSchema)
};

export const sheetSchema = Keys<ISheet>(sharedSheetSchema);

export const sheetSchemaWithID = Keys<ISheetWithID>({
	id: TypeString,
	...sharedSheetSchema
});