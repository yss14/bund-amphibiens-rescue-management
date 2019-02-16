import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { ISheetWithID, ISheet } from '../../../../shared-types/ISheet';
import moment from 'moment';
import { RouteComponentProps } from 'react-router';

interface ISheetEditorAppBarProps extends RouteComponentProps {
	sheet: ISheetWithID | ISheet;
}

export const SheetEditorAppBar: React.FunctionComponent<ISheetEditorAppBarProps> = ({ sheet, history }) => {
	const isToday = moment().isSame(moment(sheet.dateOfRecord), 'day');
	const headerTitleDate = isToday ? 'Today' : moment(sheet.dateOfRecord).format('dddd DD.MM.YYYY');

	const onClickArrowBack = () => {
		history.push('/sheets');
	}

	return (
		<AppBar position="sticky">
			<Toolbar style={{ padding: 0 }}>
				<IconButton color="inherit" onClick={onClickArrowBack}>
					<ArrowBack />
				</IconButton>
				<Typography variant="h6" color="inherit" noWrap>{headerTitleDate + ' - ' + sheet.secretary}</Typography>
			</Toolbar>
		</AppBar>
	);
}