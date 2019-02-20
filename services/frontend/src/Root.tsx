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
import { SheetsAPI } from './api/sheets-api';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Login } from './components/views/login/Login';
import { saveUserStoreToLocalStorage } from './redux/store-persist-adapter';

const history = createBrowserHistory();
const store = createReduxStore();

store.subscribe(() => {
	saveUserStoreToLocalStorage(store.getState().user);
});

const GlobalStyle = createGlobalStyle`
	html, body {
		margin: 0px;
		padding: 0px;
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

const sheetsAPI = new SheetsAPI();

interface IAPIContext {
	sheetsAPI: SheetsAPI;
}

export const APIContext = React.createContext<IAPIContext>({
	sheetsAPI: sheetsAPI
});

export const Root = () => {
	return (
		<React.Fragment>
			<GlobalStyle />
			<Provider store={store}>
				<MuiThemeProvider theme={theme}>
					<ThemeProvider theme={theme}>
						<APIContext.Provider value={{ sheetsAPI: sheetsAPI }}>
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