import axios, { AxiosInstance } from 'axios';

export interface ILoginResponse {
	authToken: string;
}

export interface ILoginAPI {
	login(name: string, password: string): Promise<ILoginResponse>;
}

export class LoginAPI implements ILoginAPI {
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

	public async login(name: string, password: string) {
		const payload = {
			name,
			password
		}

		const httpResponse = await this.axiosInstance.post<ILoginResponse>('/login', payload);

		return httpResponse.data;
	}
}