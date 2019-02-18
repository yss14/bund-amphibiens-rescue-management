import React, { useContext } from 'react';
import { DispatchPropThunk } from '../../../types/DispatchPropThunk';
import { SheetsAction, selectSheet, ISheetSelect } from '../../../redux/sheets/sheets.actions';
import { IStoreSchema } from '../../../redux/store.schema';
import { connect } from 'react-redux';
import { ISheetWithID } from '../../../../../shared-types/ISheet';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { List, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
import { SheetListItem } from './SheetListItem';
import { withRouter, RouteComponentProps } from 'react-router';
import { makeEmptySheet } from '../../../utils/create-sheet';
import { getBucketNumbers, getAmphibientsLabels } from '../../../utils/envs';
import { Dispatch } from 'redux';
import urljoin from 'url-join';
import { APIContext } from '../../../Root';
import { createSheet } from '../../../redux/sheets/actions/sheet-create.action';

interface ISheetListProps extends DispatchPropThunk<IStoreSchema, SheetsAction>, RouteComponentProps {
	sheets: ISheetWithID[];
}

const SheetListComp: React.FunctionComponent<ISheetListProps> = ({ dispatch, sheets, match, history }) => {
	const apiContext = useContext(APIContext);

	const sortSheets = (lhs: ISheetWithID, rhs: ISheetWithID) => {
		return moment(rhs.dateOfRecord).valueOf() - moment(lhs.dateOfRecord).valueOf();
	};

	const onClickAddSheet = () => {
		dispatch(
			createSheet(
				apiContext.sheetsAPI,
				makeEmptySheet(
					getBucketNumbers(),
					getAmphibientsLabels(),
					'Yannick (hardcoded)'
				)
			)
		).then(newSheet => {
			(dispatch as Dispatch<ISheetSelect>)(selectSheet(newSheet));
			history.push(urljoin(match.path, newSheet.id));
		});
	};

	const onClickListItem = (sheetID: string) => {
		const sheet = sheets.find(sheet => sheet.id === sheetID);

		if (sheet) {
			(dispatch as Dispatch<ISheetSelect>)(selectSheet(sheet));
			history.push(`${match.path}/${sheetID}`);
		}
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
			<Fab style={floatingButtonStyle} onClick={onClickAddSheet}>
				<AddIcon />
			</Fab>
		</React.Fragment>
	);
}

const mapStateToProps = (state: IStoreSchema) => ({
	sheets: state.sheets.data
});

export const SheetList = withRouter(connect(mapStateToProps)(SheetListComp));