import React, { useState, useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';
import { ISheetWithID, ISheet } from '../../../../../shared-types/ISheet';
import { IStoreSchema } from '../../../redux/store.schema';
import { connect } from 'react-redux';
import { SheetEditorAppBar } from './SheetEditorAppBar';
import { SheetMetaDataEditor } from './SheetMetaDataEditor';
import { SheetEditorPane } from './SheetEditorPane';
import { SheetTableItemsEditor } from './SheetTableItemsEditor';
import { DispatchPropThunk } from '../../../types/DispatchPropThunk';
import { Snackbar, Theme } from '@material-ui/core';
import { APIContext } from '../../../Root';
import { SheetSaveAction, saveSheet } from '../../../redux/sheets/actions/sheet-save.action';
import { usePrevious } from '../../../utils/use-previous';
import { useTheme } from '@material-ui/styles';

export type SheetPropertyChangeCallback = <T extends ISheet, K extends keyof ISheet>(propertyName: K, newValue: T[K]) => void;
export type SheetTableItemChangeCallback = (bucketNumber: number, amphibiensKind: string, newAmount: number) => void;

interface ISheetEditorProps extends RouteComponentProps<{ sheetID: string }>, DispatchPropThunk<IStoreSchema, SheetSaveAction> {
	sheet: ISheetWithID;
}

interface ISheetEditorState {
	sheet: ISheetWithID;
	showSuccessfulMessage: boolean;
}

const SheetEditorComp: React.FunctionComponent<ISheetEditorProps> = (props) => {
	const { sheet: sheetFromProps, match, dispatch, history, ...remainingProps } = props;

	const [state, setState] = useState<ISheetEditorState>({
		sheet: sheetFromProps,
		showSuccessfulMessage: false
	});

	const { sheet, showSuccessfulMessage } = state;

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

	const apiContext = useContext(APIContext);

	const onClickSave = () => {
		dispatch(saveSheet(apiContext.sheetsAPI, sheet))
			.then(() => {
				setState({ ...state, showSuccessfulMessage: true });
			});
	}

	const prevShowSuccessfulMessage = usePrevious(showSuccessfulMessage);

	useEffect(() => {
		if (!prevShowSuccessfulMessage && showSuccessfulMessage) {
			const timetoutRef = setTimeout(() => {
				setState({
					...state,
					showSuccessfulMessage: false
				});
			}, 4000);

			return () => clearTimeout(timetoutRef);
		}
	}, [showSuccessfulMessage]);

	const theme = useTheme<Theme>();

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
						backgroundColor: theme.palette.primary.light,
						justifyContent: 'center',
						color: 'black'
					}
				}}
				style={{ marginTop: document.documentElement.clientWidth <= 960 ? 0 : 8 }}
			/>
		</React.Fragment >
	);
};

const mapStateToProps = (state: IStoreSchema) => ({
	sheets: state.sheets.data
});

interface SheetEditorConnectedProps extends RouteComponentProps<{ sheetID: string }>, DispatchPropThunk<IStoreSchema, SheetSaveAction> {
	sheet: ISheetWithID | null;
	sheets: ISheetWithID[];
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