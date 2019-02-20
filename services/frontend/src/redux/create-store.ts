import { combineReducers, compose, Store, createStore, applyMiddleware } from "redux";
import { IStoreSchema } from "./store.schema";
import { sheetsReducer, defaultSheetsState } from "./sheets/sheets.reducer";
import thunk from 'redux-thunk';
import { userReducer } from "./user/user.reducer";
import { loadUserStoreFromLocalStorage } from "./store-persist-adapter";

interface IWindowWithReduxDevTools extends Window {
	__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
}

const rootReducer = combineReducers<IStoreSchema>({
	sheets: sheetsReducer,
	user: userReducer
});

const windowIfDefined = typeof window === 'undefined' ? null : window;

const composeEnhancers = (_window: Window | IWindowWithReduxDevTools | null) => {
	if (_window && isWindowWithRedusDevTools(_window)) {
		return _window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
	} else {
		return compose;
	}
};

const isWindowWithRedusDevTools = (win: any): win is IWindowWithReduxDevTools => {
	return win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined;
};

const makeDefaultState = (): IStoreSchema => ({
	sheets: defaultSheetsState,
	user: loadUserStoreFromLocalStorage()
})

export const createReduxStore = (): Store<IStoreSchema> => {
	return createStore(
		rootReducer,
		makeDefaultState(),
		composeEnhancers(windowIfDefined)(applyMiddleware(thunk))
	);
};