import { Keys, TypeString, TypeNumber, TypeBoolean, TypeEnumString, Items, TypeCheck, KeysPartial } from "../utils/checker";
import { Cloudiness, ISheetTableItem, ISheetWithID, ISheet } from "../../../shared-types/ISheet";
import * as moment from 'moment';

export const sheetTableItemSchema = Keys<ISheetTableItem>({
	amount: TypeNumber,
	amphibiansKind: TypeString,
	bucketNumber: TypeNumber
});

const sharedSheetSchema = {
	dateOfRecord: TypeCheck((value: any): value is Date => moment(value, moment.ISO_8601).isValid()),
	secretary: TypeString,
	temperature: TypeNumber,
	cloudiness: TypeEnumString(Cloudiness),
	precipitation: TypeBoolean,
	tableItems: Items(sheetTableItemSchema)
};

export const sheetSchema = KeysPartial({
	body: Keys<ISheet>(sharedSheetSchema)
});

export const sheetSchemaWithID = KeysPartial({
	body: Keys<ISheetWithID>({
		...sharedSheetSchema,
		id: TypeString
	})
});