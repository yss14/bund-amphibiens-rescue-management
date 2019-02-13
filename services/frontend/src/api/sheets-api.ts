import { ISheetWithID } from "../../../shared-types/ISheet";
import axios, { AxiosInstance } from 'axios';

export interface ISheetsAPI {
	getSheets(): Promise<ISheetWithID[]>;
}

export class SheetsAPI implements ISheetsAPI {
	private readonly axiosInstance: AxiosInstance;

	constructor(axiosInstance?: AxiosInstance) {
		if (axiosInstance) {
			this.axiosInstance = axiosInstance;
		} else {
			this.axiosInstance = axios.create({
				baseURL: process.env.REACT_APP_BACKEND_URL || 'localhost:3000'
			});
		}
	}

	public async getSheets() {
		const sheets = await this.axiosInstance.get<ISheetWithID[]>('/sheets');

		return sheets.data;
	}
}