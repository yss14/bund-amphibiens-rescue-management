import * as constants from './user.constants';
import { IUserSchema } from "./user.schema";
import { UserAction } from "./user.actions";

export const defaultUserState: IUserSchema = {
	name: '',
	authToken: ''
}

export const userReducer = (state: IUserSchema = defaultUserState, action: UserAction): IUserSchema => {
	switch (action.type) {
		case constants.USER_LOGIN:
			return { ...state, name: action.payload.name, authToken: action.payload.authToken };

		case constants.USER_LOGOUT:
			return { ...state, ...defaultUserState };

		default: return state;
	}
}