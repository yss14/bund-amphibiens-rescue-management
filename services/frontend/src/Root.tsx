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

const history = createBrowserHistory();
const store = createReduxStore();

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