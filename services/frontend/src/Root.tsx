import React from 'react';
import { createBrowserHistory } from "history";
import { createReduxStore } from "./redux/create-store";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { NotFound } from "./components/views/other/NotFound";
import { createGlobalStyle } from 'styled-components';
import { SheetRouter } from './components/views/routers/SheetRouter';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { SheetsAPI, ISheetsAPI } from './api/sheets-api';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Login } from './components/views/login/Login';
import { saveUserStoreToLocalStorage } from './redux/store-persist-adapter';
import axios from 'axios';
import { isAxiosError } from './typeguards/is-axios-error';
import { logout } from './redux/user/user.actions';
import { LoginAPI, ILoginAPI } from './api/login-api';
import { getAppTitle } from './utils/get-app-title';

const history = createBrowserHistory();
const store = createReduxStore();

store.subscribe(() => {
	saveUserStoreToLocalStorage(store.getState().user);
});

const GlobalStyle = createGlobalStyle`
	html, body, #root {
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
		background-color: #ecf0f1;
	}

	#root{
		background-color: white;
	}

	@media only screen and (min-width : 1200px) {
		#root{
			width: 1200px;
			position: relative;
			margin: 0 auto;
		}

		header{
			width: 1200px !important;
			right: auto !important;
		}
	}
`;

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#77b438',
			contrastText: 'white',
			light: '#f3f3f3'
		},
	},
	typography: {
		useNextVariants: true,
	},
});

const appTitle = getAppTitle();
document.title = appTitle;

const sharedAxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL || 'localhost:3000'
});

sharedAxiosInstance.interceptors.request.use((config) => {
	config.headers['Authorization'] = store.getState().user.authToken
	return config;
}, (err) => Promise.reject(err));

sharedAxiosInstance.interceptors.response.use((response) => response, (err) => {
	if (isAxiosError(err) && err.response.status === 401) {
		store.dispatch(logout());
		history.push('/');
	}

	return Promise.reject(err);
});

const sheetsAPI = new SheetsAPI(sharedAxiosInstance);
const loginAPI = new LoginAPI(sharedAxiosInstance);

interface IAPIContext {
	sheetsAPI: ISheetsAPI;
	loginAPI: ILoginAPI;
}

export const APIContext = React.createContext<IAPIContext>({
	sheetsAPI,
	loginAPI
});

export const Root = () => {
	return (
		<React.Fragment>
			<GlobalStyle />
			<Provider store={store}>
				<MuiThemeProvider theme={theme}>
					<ThemeProvider theme={theme}>
						<APIContext.Provider value={{ sheetsAPI, loginAPI }}>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<MainRouter />
							</MuiPickersUtilsProvider>
						</APIContext.Provider>
					</ThemeProvider>
				</MuiThemeProvider>
			</Provider>
		</React.Fragment>
	);
}

const MainRouter = () => {
	return (
		<Router history={history}>
			<Switch>
				<Route path="/sheets" component={SheetRouter} />
				<Route path="/" component={Login} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
};