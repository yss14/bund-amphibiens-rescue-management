import React from 'react';
import { createBrowserHistory } from "history";
import { createReduxStore } from "./redux/create-store";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { NotFound } from "./views/other/NotFound";
import { createGlobalStyle } from 'styled-components';
import { SheetRouter } from './views/routers/SheetRouter';

const history = createBrowserHistory();
const store = createReduxStore();

const GlobalStyle = createGlobalStyle`
	html, body {
		margin: 0px;
		padding: 0px;
	}
`;

export const Root = () => (
	<React.Fragment>
		<GlobalStyle />
		<Provider store={store}>
			<Router history={history}>
				<Switch>
					<Route path="/sheets" component={SheetRouter} />
					<Route component={NotFound} />
				</Switch>
			</Router>
		</Provider>
	</React.Fragment>
);