import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ISheetWithID, ISheet } from '../../../../shared-types/ISheet';
import { createEmptySheet } from '../../utils/create-sheet';
import { getBucketNumbers, getAmphibientsLabels } from '../../utils/envs';
import { AppBar, Toolbar, Typography, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { IStoreSchema } from '../../redux/store.schema';
import { connect } from 'react-redux';
import moment from 'moment';
import { Cloudiness } from '../../types/Cloudiness';
import { InlineDateTimePicker } from 'material-ui-pickers';

type SheetEditorMode = 'new' | 'update';

interface ISheetEditorProps extends RouteComponentProps<{ sheetID: string }> {
	sheets: ISheetWithID[];
}

interface ISheetEditorState {
	sheet: ISheet | ISheetWithID | null;
}

const SheetEditorComp: React.FunctionComponent<ISheetEditorProps> = ({ sheets, match }) => {
	const mode = match.params.sheetID === 'new' ? 'new' : 'update';

	const [state, setState] = useState<ISheetEditorState>({
		sheet: getSheet(sheets, mode, match.params.sheetID)
	});

	useEffect(() => {
		setState({
			...state,
			sheet: getSheet(sheets, mode, match.params.sheetID)
		});
	}, [sheets]);

	const { sheet } = state;

	if (sheet === null) {
		return null; // TODO: Show loading spinner
	}

	const onChangeSheetProperty = <T extends ISheet, K extends keyof ISheet>(propertyName: K, newValue: T[K]) => {
		setState({
			...state,
			sheet: {
				...sheet,
				[propertyName]: newValue
			}
		});
	}

	const isToday = moment().isSame(moment(sheet.dateOfRecord), 'day');
	const headerTitleDate = isToday ? 'Today' : moment(sheet.dateOfRecord).format('dddd DD.MM.YYYY');

	return (
		<React.Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>{headerTitleDate + ' - ' + sheet.secretary}</Typography>
				</Toolbar>
			</AppBar>
			<div style={{ padding: '0px 20px' }}>
				<div>
					<TextField
						id="secretary"
						label="Zähler"
						value={sheet.secretary}
						onChange={(e) => onChangeSheetProperty('secretary', e.target.value)}
						margin="normal"
						error={sheet.secretary.trim().length === 0}
					/>
				</div>
				<div>
					<InlineDateTimePicker
						label="Datum/Uhrzeit"
						value={sheet.dateOfRecord}
						onChange={(newDate) => onChangeSheetProperty('dateOfRecord', newDate)}
					/>
				</div>
				<div>
					<TextField
						id="temperature"
						label="Temperatur"
						value={sheet.temperature}
						onChange={(e) => onChangeSheetProperty('temperature', parseInt(e.target.value))}
						margin="normal"
						type="number"
						inputProps={{
							pattern: "[0-9]*"
						}}
						error={isNaN(sheet.temperature) || sheet.temperature <= -30 || sheet.temperature >= 40}
					/>
				</div>
				<div>
					<TextField
						id="cloudiness"
						select
						label="Bewölkung"
						value={sheet.cloudiness}
						onChange={(e) => onChangeSheetProperty('cloudiness', e.target.value as Cloudiness)}
						SelectProps={{
							native: true,
						}}
						helperText="Bitte Bewölkung wählen"
						margin="normal"
					>
						<option key={Cloudiness.NoClouds} value={Cloudiness.NoClouds}>Keine</option>
						<option key={Cloudiness.Slightly} value={Cloudiness.Slightly}>Leicht</option>
						<option key={Cloudiness.Heavy} value={Cloudiness.Heavy}>Stark</option>
					</TextField>
				</div>
				<div>
					<FormControlLabel
						control={
							<Checkbox
								checked={sheet.precipitation}
								onChange={(e) => onChangeSheetProperty('precipitation', e.target.checked)}
								value={'precipitation'}
								color="primary"
							/>
						}
						label="Niederschlag"
					/>
				</div>
			</div>
		</React.Fragment>
	);
}

const mapStateToProps = (state: IStoreSchema) => ({
	sheets: state.sheets.data
});

export const SheetEditor = withRouter(connect(mapStateToProps)(SheetEditorComp));

const getSheet = (sheets: ISheetWithID[], mode: SheetEditorMode, sheetID: string) => {
	if (mode === 'update') {
		const sheet = sheets.find(sheet => sheet.id === sheetID);

		if (sheet) {
			return sheet;
		} else {
			return null;
		}
	} else {
		return createEmptySheet(
			getBucketNumbers(),
			getAmphibientsLabels(),
			'Yannick (hardcoded)'
		);
	}
}