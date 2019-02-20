import { IUserSchema } from "./user/user.schema";

const KEY = 'bund-amphibiens-resuce-management-user';

export const loadUserStoreFromLocalStorage = (): IUserSchema => {
	try {
		const serializedState = window.localStorage.getItem(KEY);

		if (serializedState) {
			return JSON.parse(serializedState);
		}
	} catch (err) {
		console.error(err);
	}

	return {
		name: '',
		authToken: ''
	}
}

export const saveUserStoreToLocalStorage = (userState: IUserSchema) => {
	try{
		window.localStorage.setItem(KEY, JSON.stringify(userState));
	}catch(err){
		console.error(err);
	}
}