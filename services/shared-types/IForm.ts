export enum Cloudiness {
	NoClouds = 'no_clouds',
	Slightly = 'slightly',
	Heavy = 'heavy'
}

export interface IFormTableItem {
	bucketNumber: number;
	amphibiansKind: string;
	amount: number;
}

export interface IForm {
	dateOfRecord: Date;
	secretary: string;
	temperature: number;
	cloudiness: Cloudiness;
	precipitation: boolean;
	tableItems: IFormTableItem[];
}

export interface IFormWithID extends IForm {
	id: string;
}

export const isFormWithID = (form: any): form is IFormWithID => {
	return (<IFormWithID>form).id !== undefined && form._id !== null;
}