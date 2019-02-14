import React, { useEffect } from 'react';
import { createBrowserHistory } from "history";
import { createReduxStore } from "./redux/create-store";
import { Provider, connect } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { NotFound } from "./views/other/NotFound";
import { createGlobalStyle } from 'styled-components';
import { SheetRouter } from './views/routers/SheetRouter';
import { fetchShares, SheetsAction } from './redux/sheets/sheets.actions';
import { SheetsAPI } from './api/sheets-api';
import { DispatchPropThunk } from './types/DispatchPropThunk';
import { IStoreSchema } from './redux/store.schema';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

const history = createBrowserHistory();
const store = createReduxStore();
const sheetsAPI = new SheetsAPI();

const GlobalStyle = createGlobalStyle`
	html, body {
		margin: 0px;
		padding: 0px;
	}
`;

export const Root = () => {
	return (
		<React.Fragment>
			<GlobalStyle />
			<Provider store={store}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<MainRouter />
				</MuiPickersUtilsProvider>
			</Provider>
		</React.Fragment>
	);
}

const MainRouter = connect()(({ dispatch }: DispatchPropThunk<IStoreSchema, SheetsAction>) => {
	useEffect(() => {
		dispatch(fetchShares(sheetsAPI));
	}, []);

	return (
		<Router history={history}>
			<Switch>
				<Route path="/sheets" component={SheetRouter} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
});