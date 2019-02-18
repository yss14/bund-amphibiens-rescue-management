import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';
import { ISheetWithID, ISheet } from '../../../../../shared-types/ISheet';
import { IStoreSchema } from '../../../redux/store.schema';
import { connect } from 'react-redux';
import { SheetEditorAppBar } from './SheetEditorAppBar';
import { SheetMetaDataEditor } from './SheetMetaDataEditor';
import { SheetEditorPane } from './SheetEditorPane';
import { SheetTableItemsEditor } from './SheetTableItemsEditor';
import { DispatchPropThunk } from '../../../types/DispatchPropThunk';
import { SheetSaveAction, saveSheet } from '../../../redux/sheets/sheets.actions';
import { SheetsAPI } from '../../../api/sheets-api';
import { Snackbar } from '@material-ui/core';

export type SheetPropertyChangeCallback = <T extends ISheet, K extends keyof ISheet>(propertyName: K, newValue: T[K]) => void;
export type SheetTableItemChangeCallback = (bucketNumber: number, amphibiensKind: string, newAmount: number) => void;

interface ISheetEditorProps extends RouteComponentProps<{ sheetID: string }>, DispatchPropThunk<IStoreSchema, SheetSaveAction> {
	sheet: ISheetWithID;
	isSaving: boolean;
}

interface ISheetEditorState {
	sheet: ISheetWithID;
	showSuccessfulMessage: boolean;
}

const SheetEditorComp: React.FunctionComponent<ISheetEditorProps> = (props) => {
	const { sheet: sheetFromProps, match, dispatch, isSaving, history, ...remainingProps } = props;

	const [state, setState] = useState<ISheetEditorState>({
		sheet: sheetFromProps,
		showSuccessfulMessage: false
	});

	useEffect(() => {
		if (!state.showSuccessfulMessage && isSaving) {
			setState({
				...state,
				showSuccessfulMessage: true
			});

			const timeoutRef = setTimeout(() => setState({ ...state, showSuccessfulMessage: false }), 5000);

			return () => clearTimeout(timeoutRef);
		}
	}, [isSaving]);

	const { sheet } = state;

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

	const onClickSave = () => {
		dispatch(saveSheet(new SheetsAPI(), sheet));
	}

	return (
		<React.Fragment>
			<SheetEditorAppBar sheet={sheet} match={match} history={history} {...remainingProps} onClickSave={onClickSave} />
			<SheetEditorPane>
				<SheetMetaDataEditor sheet={sheet} onChangeSheetProperty={onChangeSheetProperty} />
				<SheetTableItemsEditor sheet={sheet} onChangeSheetTableItem={onChangeSheetTableItem} />
			</SheetEditorPane>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={state.showSuccessfulMessage}
				message={<span>Erfolgreich gespeichert</span>}
				ContentProps={{
					style: {
						backgroundColor: '#43a047',
						justifyContent: 'center'
					}
				}}
				style={{ marginTop: document.documentElement.clientWidth <= 960 ? 0 : 8 }}
			/>
		</React.Fragment >
	);
}

const mapStateToProps = (state: IStoreSchema) => ({
	isSaving: state.sheets.isSaving,
	sheets: state.sheets.data
});

interface SheetEditorConnectedProps extends RouteComponentProps<{ sheetID: string }>, DispatchPropThunk<IStoreSchema, SheetSaveAction> {
	sheet: ISheetWithID | null;
	sheets: ISheetWithID[];
	isSaving: boolean;
}

const SheetEditorConnected = connect(mapStateToProps)(({ match, sheet, sheets, ...props }: SheetEditorConnectedProps) => {
	let sheetArg: ISheetWithID | null;

	if (sheet) {
		sheetArg = sheet;
	} else {
		sheetArg = sheets.find(sheetFromStore => sheetFromStore.id === match.params.sheetID) || null;
	}

	if (sheetArg) {
		return <SheetEditorComp sheet={sheetArg} match={match} {...props} />
	} else {
		console.log('Redirect');
		return <Redirect to="/404" />
	}
});

export const SheetEditor = withRouter(connect(mapStateToProps)(SheetEditorConnected));