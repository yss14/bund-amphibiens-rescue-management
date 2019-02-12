import React from 'react';
import { createBrowserHistory } from "history";
import { createReduxStore } from "./redux/create-store";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { NotFound } from "./views/other/NotFound";

const history = createBrowserHistory();
const store = createReduxStore();

const Hello = () => (<div>Hello</div>);

export const Root = () => (
	<Provider store={store}>
		<Router history={history}>
			<Switch>
				<Route path="/" component={Hello} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	</Provider>
);