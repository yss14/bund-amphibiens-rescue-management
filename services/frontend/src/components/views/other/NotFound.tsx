import React from 'react';
import img404 from '../../../images/404.png';
import styled from 'styled-components';

const CenteredWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	flex-direction: column;
`;

export const NotFound = () => (
	<CenteredWrapper>
		<img src={img404} alt="404 Seite nicht gefunden" width="128px" height="128px" />
		<div style={{ paddingTop: 10, fontSize: 24, fontWeight: 'bold' }}>Seite nicht gefunden</div>
	</CenteredWrapper>
);