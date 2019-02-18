import { ISheetWithID, ISheet } from "../../../shared-types/ISheet";
import axios, { AxiosInstance } from 'axios';

export interface ISheetsAPI {
	getSheets(): Promise<ISheetWithID[]>;
	createSheet(sheet: ISheet): Promise<ISheetWithID>;
	updateSheet(sheet: ISheetWithID): Promise<void>;
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
		const apiResult = await this.axiosInstance.get<ISheetWithID[]>('/sheets');

		return apiResult.data;
	}

	public async updateSheet(sheet: ISheetWithID) {
		await this.axiosInstance.put(`/sheets/${sheet.id}`, sheet);
	}

	public async createSheet(sheet: ISheet): Promise<ISheetWithID> {
		const apiResult = await this.axiosInstance.post<ISheetWithID>(`/sheets`, sheet);

		return apiResult.data;
	}
}