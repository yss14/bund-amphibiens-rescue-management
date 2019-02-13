import React from 'react';
import { withRouter, Route } from "react-router";
import { SheetEditor } from '../sheet-editor/SheetEditor';
import { SheetList } from '../sheet-list/SheetList';

export const SheetRouter = withRouter(({ match }) => {
	return (
		<React.Fragment>
			<Route path="/sheets/:sheetID/" component={SheetEditor} />
			<Route exact path={match.url} component={SheetList} />
		</React.Fragment>
	);
});