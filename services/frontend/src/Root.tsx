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

const history = createBrowserHistory();
const store = createReduxStore();

const GlobalStyle = createGlobalStyle`
	html, body {
		margin: 0px;
		padding: 0px;
	}
`;

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
				<APIContext.Provider value={{ sheetsAPI: sheetsAPI }}>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<MainRouter />
					</MuiPickersUtilsProvider>
				</APIContext.Provider>
			</Provider>
		</React.Fragment>
	);
}

const MainRouter = () => {
	return (
		<Router history={history}>
			<Switch>
				<Route path="/sheets" component={SheetRouter} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
};