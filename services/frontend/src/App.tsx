import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from './views/other/NotFound';

class App extends Component {
	render() {
		return (
			<Switch>
				<Route component={NotFound} />
			</Switch>
		);
	}
}

export default App;
