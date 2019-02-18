import React from 'react';
import { TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { ISheetWithID, ISheet } from '../../../../../shared-types/ISheet';
import { SheetPropertyChangeCallback } from './SheetEditor';
import { InlineDateTimePicker } from 'material-ui-pickers';
import { Cloudiness } from '../../../types/Cloudiness';

interface SheetMetaDataEditorProps {
	sheet: ISheetWithID | ISheet;
	onChangeSheetProperty: SheetPropertyChangeCallback;
}

export const SheetMetaDataEditor: React.FunctionComponent<SheetMetaDataEditorProps> = (props) => {
	const { sheet, onChangeSheetProperty } = props;

	return (
		<React.Fragment>
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
					ampm={false}
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
		</React.Fragment>
	);
}