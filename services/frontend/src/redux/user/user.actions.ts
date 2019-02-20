import * as constants from './user.constants';
import { IUserSchema } from './user.schema';
import { IStoreSchema } from '../store.schema';
import { ThunkDispatch } from 'redux-thunk';

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

export const login = (api: any, name: string, password: string) =>
	async (dispatch: ThunkDispatch<IStoreSchema, void, IUserLogin>) => {
		dispatch(loginSuccess(name, 'sometoken'));
	}

export type UserAction = IUserLogin;