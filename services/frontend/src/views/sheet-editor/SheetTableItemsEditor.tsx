import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { getAmphibientsLabels } from '../../utils/envs';
import { groupBy } from 'lodash';
import { ISheetWithID, ISheet } from '../../../../shared-types/ISheet';
import { SheetTableItemChangeCallback } from './SheetEditor';

const TableScrollWrapper = styled.div`
	width: 100%;
	overflow-x: auto;
`;

const tableCellStyle: React.CSSProperties = {
	paddingRight: 20,
}

interface ISheetTableItemsEditorProps {
	sheet: ISheetWithID | ISheet;
	onChangeSheetTableItem: SheetTableItemChangeCallback;
}

export const SheetTableItemsEditor: React.FunctionComponent<ISheetTableItemsEditorProps> = ({ sheet, onChangeSheetTableItem }) => {
	const amphibiensLabels = getAmphibientsLabels();
	const tableItemsGrouped = groupBy(sheet.tableItems, 'bucketNumber');

	for (const tableItems of Object.values(tableItemsGrouped)) {
		tableItems.sort((lhs, rhs) =>
			amphibiensLabels.indexOf(lhs.amphibiansKind) - amphibiensLabels.indexOf(rhs.amphibiansKind))
	}

	return (
		<TableScrollWrapper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={tableCellStyle}>Eimer</TableCell>
						{amphibiensLabels.map(amphibiensLabel => <TableCell key={amphibiensLabel} style={tableCellStyle}>{amphibiensLabel}</TableCell>)}
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(tableItemsGrouped).map(bucketNumber => (
						<TableRow key={bucketNumber}>
							<TableCell style={tableCellStyle}>{bucketNumber}</TableCell>
							{tableItemsGrouped[bucketNumber].map((tableItem, idx) => (
								<TableCell key={`${bucketNumber}-${tableItem.amphibiansKind}`} style={tableCellStyle}>
									<TextField
										value={tableItem.amount}
										margin="normal"
										type="number"
										style={{ width: 50 }}
										onChange={e => onChangeSheetTableItem(tableItem.bucketNumber, tableItem.amphibiansKind, parseInt(e.target.value))}
										error={tableItem.amount < 0 || isNaN(tableItem.amount)}
									/>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableScrollWrapper>
	);
}