import * as constants from './user.constants';
import { IUserSchema } from './user.schema';
import { IStoreSchema } from '../store.schema';
import { ThunkDispatch } from 'redux-thunk';
import { ILoginAPI } from '../../api/login-api';

export interface IUserLogin {
	type: constants.USER_LOGIN;
	payload: IUserSchema;
}

export const loginSuccess = (name: string, authToken: string): IUserLogin => ({
	type: constants.USER_LOGIN,
	payload: {
		name,
		authToken
	}
})

export const login = (api: ILoginAPI, name: string, password: string) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, IUserLogin>) => {
		try {
			const { authToken } = await api.login(name, password);

			dispatch(loginSuccess(name, authToken));
		} catch (err) {
			console.error(err);

			return Promise.reject(err);
		}
	}

export interface IUserLogout {
	type: constants.USER_LOGOUT;
	payload: undefined;
}

export const logout = (): IUserLogout => ({
	type: constants.USER_LOGOUT,
	payload: undefined
})

export type UserAction = IUserLogin | IUserLogout;