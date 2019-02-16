import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ISheetWithID, ISheet } from '../../../../shared-types/ISheet';
import { createEmptySheet } from '../../utils/create-sheet';
import { getBucketNumbers, getAmphibientsLabels } from '../../utils/envs';
import { IStoreSchema } from '../../redux/store.schema';
import { connect } from 'react-redux';
import { SheetEditorAppBar } from './SheetEditorAppBar';
import { SheetMetaDataEditor } from './SheetMetaDataEditor';
import { SheetEditorPane } from './SheetEditorPane';
import { SheetTableItemsEditor } from './SheetTableItemsEditor';

type SheetEditorMode = 'new' | 'update';
export type SheetPropertyChangeCallback = <T extends ISheet, K extends keyof ISheet>(propertyName: K, newValue: T[K]) => void;
export type SheetTableItemChangeCallback = (bucketNumber: number, amphibiensKind: string, newAmount: number) => void;

interface ISheetEditorProps extends RouteComponentProps<{ sheetID: string }> {
	sheets: ISheetWithID[];
}

interface ISheetEditorState {
	sheet: ISheet | ISheetWithID | null;
}

const SheetEditorComp: React.FunctionComponent<ISheetEditorProps> = (props) => {
	const { sheets, match, ...remainingProps } = props;
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

	const onChangeSheetProperty: SheetPropertyChangeCallback = (propertyName, newValue) => {
		setState({
			...state,
			sheet: {
				...sheet,
				[propertyName]: newValue
			}
		});
	}

	const onChangeSheetTableItem: SheetTableItemChangeCallback = (bucketNumber, amphibiensKind, newAmount) => {
		setState({
			...state,
			sheet: {
				...sheet,
				tableItems: sheet.tableItems
					.map(tableItem => tableItem.bucketNumber === bucketNumber && tableItem.amphibiansKind === amphibiensKind
						? { ...tableItem, amount: newAmount }
						: tableItem
					)
			}
		})
	}

	return (
		<React.Fragment>
			<SheetEditorAppBar sheet={sheet} match={match} {...remainingProps} />
			<SheetEditorPane>
				<SheetMetaDataEditor sheet={sheet} onChangeSheetProperty={onChangeSheetProperty} />
				<SheetTableItemsEditor sheet={sheet} onChangeSheetTableItem={onChangeSheetTableItem} />
			</SheetEditorPane>
		</React.Fragment >
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