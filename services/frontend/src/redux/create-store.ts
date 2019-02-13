import { combineReducers, compose, Store, createStore, applyMiddleware } from "redux";
import { IStoreSchema } from "./store.schema";
import { sheetsReducer } from "./sheets/sheets.reducer";
import thunk from 'redux-thunk';

interface IWindowWithReduxDevTools extends Window {
	__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
}

const rootReducer = combineReducers<IStoreSchema>({
	sheets: sheetsReducer
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

export const createReduxStore = (): Store<IStoreSchema> => {
	return createStore(
		rootReducer,
		composeEnhancers(windowIfDefined)(applyMiddleware(thunk))
	);
};