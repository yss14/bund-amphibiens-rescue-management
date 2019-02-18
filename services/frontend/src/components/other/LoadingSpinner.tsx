import React from 'react';
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";

const LoadingSpinnerContainer = styled.div`
	left: 50%;
	top: 50%;
	transform: translate(-50% -50%);
	position: absolute;
`;

export const LoadingSpinner = () => (
	<LoadingSpinnerContainer>
		<CircularProgress />
	</LoadingSpinnerContainer>
);