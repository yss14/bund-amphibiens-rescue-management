import { AxiosError, AxiosResponse } from "axios";

export interface AxiosErrorWithResponse extends AxiosError {
	response: AxiosResponse;
}

export const isAxiosError = (err: any): err is AxiosErrorWithResponse =>
	err.response !== undefined && err.request !== undefined;