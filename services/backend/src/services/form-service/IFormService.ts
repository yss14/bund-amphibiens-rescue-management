import { IForm, IFormWithID } from "../../../../shared-types/IForm";

export interface IFormService {
	getForm(id: string): Promise<IFormWithID>;
	getAllForms(): Promise<IFormWithID[]>;

	createForm(form: IForm): Promise<IFormWithID>;
	updateForm(form: IFormWithID): Promise<void>;
}