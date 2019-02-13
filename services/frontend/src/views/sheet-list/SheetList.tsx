import React, { useEffect } from 'react';
import { DispatchPropThunk } from '../../types/DispatchPropThunk';
import { SheetsAction, fetchShares } from '../../redux/sheets/sheets.actions';
import { IStoreSchema } from '../../redux/store.schema';
import { connect } from 'react-redux';
import { ISheetWithID } from '../../../../shared-types/ISheet';
import { SheetsAPI } from '../../api/sheets-api';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { List, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
import { SheetListItem } from './SheetListItem';
import { withRouter, RouteComponentProps } from 'react-router';

interface ISheetListProps extends DispatchPropThunk<IStoreSchema, SheetsAction>, RouteComponentProps {
	sheets: ISheetWithID[];
}

const SheetListComp: React.FunctionComponent<ISheetListProps> = ({ dispatch, sheets, match, history }) => {

	useEffect(() => {
		if (sheets.length === 0) {
			dispatch(fetchShares(new SheetsAPI()));
		}
	}, []);

	const sortSheets = (lhs: ISheetWithID, rhs: ISheetWithID) => {
		return moment(rhs.dateOfRecord).valueOf() - moment(lhs.dateOfRecord).valueOf();
	};

	const onClickFloatingButton = () => {
		history.push(`${match.path}/new`);
	};

	const onClickListItem = (sheetID: string) => {
		history.push(`${match.path}/${sheetID}`);
	};

	const floatingButtonStyle: React.CSSProperties = {
		position: 'fixed',
		bottom: 25,
		left: '50%',
		transform: 'translateX(-50%)',
		zIndex: 100
	};

	return (
		<React.Fragment>
			<AppBar position="fixed">
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>
						BUND - Froschverwaltung
          			</Typography>
				</Toolbar>
			</AppBar>
			<List style={{ marginTop: 64, paddingTop: 0, overflowY: 'auto' }}>
				{sheets.sort(sortSheets).map((sheet, i) =>
					<SheetListItem
						key={sheet.id}
						sheet={sheet}
						onClick={() => onClickListItem(sheet.id)}
						isSameDayAsPrevItem={i > 0 && moment(sheet.dateOfRecord).isSame(sheets[i - 1].dateOfRecord, 'day')}
					/>
				)}
			</List>
			<Fab style={floatingButtonStyle} onClick={onClickFloatingButton}>
				<AddIcon />
			</Fab>
		</React.Fragment>
	);
}

const mapStateToProps = (state: IStoreSchema) => ({
	sheets: state.sheets.data
});

export const SheetList = withRouter(connect(mapStateToProps)(SheetListComp));