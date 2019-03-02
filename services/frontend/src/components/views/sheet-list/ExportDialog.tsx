import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@material-ui/core';
import { APIContext } from '../../../Root';
import { useState, useContext } from 'react';
import { makeExportForYearAsExcel } from '../../../api/excel-api';

interface IExportDialogProps {
	open: boolean;
	onClose: () => void;
	years: number[];
}

export const ExportDialog: React.FunctionComponent<IExportDialogProps> = ({ open, onClose, years }) => {
	const [year, setYear] = useState(new Date().getFullYear());
	const { sheetsAPI } = useContext(APIContext);

	const onClickExport = async () => {
		const exportForYearAsExcel = await makeExportForYearAsExcel();

		exportForYearAsExcel(sheetsAPI, year)
			.then(() => {
				onClose();
			});
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Exportieren</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Export der Daten eines Jahres als Excel-Tabelle.
            	</DialogContentText>
				<TextField
					select
					autoFocus
					margin="dense"
					id="year"
					label="Jahr"
					fullWidth
					value={year}
					onChange={(e) => setYear(parseInt(e.target.value))}
					SelectProps={{
						native: true,
					}}
				>
					{years.map(year => <option key={year} value={year}>{year}</option>)}
				</TextField>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Abbrechen
            </Button>
				<Button onClick={onClickExport} color="primary">
					Exportieren
            </Button>
			</DialogActions>
		</Dialog>
	);
}