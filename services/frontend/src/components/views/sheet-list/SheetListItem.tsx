import React from 'react';
import { ISheetWithID } from '../../../../../shared-types/ISheet';
import { ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import moment from 'moment';
import styled from 'styled-components';

interface ISheetListItemProps {
	sheet: ISheetWithID;
	isSameDayAsPrevItem: boolean;
	onClick: () => void;
}

const DayIcon = styled.div`
	width: 40px;
	height: 40px;
	display: flex;
    position: relative;
    overflow: hidden;
    font-size: 1.25rem;
    align-items: center;
    flex-shrink: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    user-select: none;
    border-radius: 50%;
    justify-content: center;
	color: white;
	color: #fafafa;
    background-color: #bdbdbd;
`;

export const SheetListItem: React.FunctionComponent<ISheetListItemProps> = ({ sheet, isSameDayAsPrevItem, onClick }) => {
	const isToday = moment().isSame(moment(sheet.dateOfRecord), 'day');
	const subheaderTitle = isToday ? 'Heute' : moment(sheet.dateOfRecord).format('dddd DD.MM.YYYY');

	return (
		<React.Fragment key={sheet.id}>
			{!isSameDayAsPrevItem && <ListSubheader style={{ lineHeight: '40px', backgroundColor: 'white' }}>{subheaderTitle}</ListSubheader>}
			<ListItem button onClick={onClick}>
				<DayIcon>{moment(sheet.dateOfRecord).format('dd')}</DayIcon>
				<ListItemText primary={sheet.secretary} secondary={sheet.secretary} />
			</ListItem>
		</React.Fragment>
	);
}