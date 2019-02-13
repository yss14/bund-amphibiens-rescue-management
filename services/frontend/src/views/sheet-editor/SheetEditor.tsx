import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ISheetWithID, ISheet } from '../../../../shared-types/ISheet';
import { createEmptySheet } from '../../utils/create-sheet';
import { getBucketNumbers, getAmphibientsLabels } from '../../utils/envs';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { IStoreSchema } from '../../redux/store.schema';
import { connect } from 'react-redux';

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

	console.log(state, setState);

	return (
		<AppBar position="sticky">
			<Toolbar>
				<Typography variant="h6" color="inherit" noWrap>{mode}</Typography>
			</Toolbar>
		</AppBar>
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