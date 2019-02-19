import React, { useEffect, useState, useContext } from 'react';
import { withRouter, Route, RouteComponentProps, Switch } from "react-router";
import { SheetEditor } from '../sheet-editor/SheetEditor';
import { SheetList } from '../sheet-list/SheetList';
import { connect } from 'react-redux';
import { DispatchPropThunk } from '../../../types/DispatchPropThunk';
import { IStoreSchema } from '../../../redux/store.schema';
import { SheetsAction } from '../../../redux/sheets/sheets.actions';
import { LoadingSpinner } from '../../other/LoadingSpinner';
import { ISheetWithID } from '../../../../../shared-types/ISheet';
import { NotFound } from '../other/NotFound';
import { APIContext } from '../../../Root';
import { fetchShares } from '../../../redux/sheets/actions/sheets-fetch.action';

export const SheetRouter = withRouter((props) => {
	return <ConnectedSheetRouter {...props} />
});

const mapStateToProps = (store: IStoreSchema) => ({
	selectedSheet: store.sheets.selectedSheet
});

interface ConnectedSheetRouterProps extends RouteComponentProps, DispatchPropThunk<IStoreSchema, SheetsAction> {
	selectedSheet: ISheetWithID | null;
}

const ConnectedSheetRouter = connect(mapStateToProps)(({ dispatch, match, selectedSheet }: ConnectedSheetRouterProps) => {
	const [fetchedSheets, setFetchedSheets] = useState(false);

	const apiContext = useContext(APIContext);

	useEffect(() => {
		dispatch(fetchShares(apiContext.sheetsAPI))
			.then(() => setFetchedSheets(true));
	}, []);

	if (!fetchedSheets) {
		return <LoadingSpinner />;
	}
	console.log(match.path)
	return (
		<Switch>
			<Route exact path={`${match.path}/:sheetID([a-zA-Z0-9]{24})`} render={
				() => <SheetEditor sheet={selectedSheet} />
			} />
			<Route exact path={`${match.path}`} component={SheetList} />
			<Route component={NotFound} />
		</Switch>
	);
});