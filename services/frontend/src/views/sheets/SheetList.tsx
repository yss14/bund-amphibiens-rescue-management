import React, { useEffect, Fragment } from 'react';
import { DispatchPropThunk } from '../../types/DispatchPropThunk';
import { SheetsAction, fetchShares } from '../../redux/sheets/sheets.actions';
import { IStoreSchema } from '../../redux/store.schema';
import { connect } from 'react-redux';
import { ISheetWithID } from '../../../../shared-types/ISheet';
import { SheetsAPI } from '../../api/sheets-api';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Paper, List, ListSubheader, ListItem, Avatar, ListItemText } from '@material-ui/core';
import moment from 'moment';
import { SheetListItem } from './SheetListItem';

interface ISheetListProps extends DispatchPropThunk<IStoreSchema, SheetsAction> {
	sheets: ISheetWithID[];
}

const SheetListComp: React.FunctionComponent<ISheetListProps> = ({ dispatch, sheets, ...props }) => {

	useEffect(() => {
		dispatch(fetchShares(new SheetsAPI()));
	}, []);

	const sortSheets = (lhs: ISheetWithID, rhs: ISheetWithID) => {
		return moment(rhs.dateOfRecord).valueOf() - moment(lhs.dateOfRecord).valueOf();
	};

	return (
		<React.Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>
						BUND - Froschverwaltung
          			</Typography>
				</Toolbar>
			</AppBar>
			<Paper square>
				<Typography variant="h6" gutterBottom style={{ marginBottom: '0px' }}>
					Einträge
        		</Typography>
				<List style={{ paddingTop: 0 }}>
					{sheets.sort(sortSheets).map((sheet, i) =>
						<SheetListItem key={sheet.id} sheet={sheet} isSameDayAsPrevItem={i > 0 && moment(sheet.dateOfRecord).isSame(sheets[i - 1].dateOfRecord, 'day')} />)}
				</List>
			</Paper>
		</React.Fragment>
	);
}

const mapStateToProps = (state: IStoreSchema) => ({
	sheets: state.sheets.data
});

export const SheetList = connect(mapStateToProps)(SheetListComp);