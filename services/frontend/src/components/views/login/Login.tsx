import React, { useState, useContext } from 'react';
import { Avatar, Typography, FormControl, InputLabel, Input, Button } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { DispatchPropThunk } from '../../../types/DispatchPropThunk';
import { IStoreSchema } from '../../../redux/store.schema';
import { UserAction, login } from '../../../redux/user/user.actions';
import { Redirect } from 'react-router';
import { APIContext } from '../../../Root';
import { isAxiosError } from '../../../typeguards/is-axios-error';

const LoginWrapper = styled.div`
	width: 100%;
	height: 100%;
	background-color: #77b438;
`;

const LoginModal = styled.div`
	&{
		width: 320px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px;
		box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
		border-radius: 4px;
		background-color: white;
		display: flex;
		flex-direction: column;
   	 	align-items: center;
	}

	@media (max-width: 460px){
		&{
			margin: auto 20px;
			width: auto;
			left: auto;
			top: 50%;
			transform: translateY(-50%);
		}
	}
`;

const ErrorHint = styled.div`
	color: #f44336;
	font-family: "Roboto", "Helvetica", "Arial", sans-serif;
	font-size: 12px;
    padding-top: 6px;
`;

const isValidName = (name: string | null) => name !== null && name.trim().length > 0;
const isValidPassword = (password: string | null) => password !== null && password.trim().length > 0;

const mapStateToProps = (store: IStoreSchema) => ({
	accessToken: store.user.authToken
})

interface ILoginProps extends DispatchPropThunk<IStoreSchema, UserAction> {
	accessToken: string;
}

export const Login = connect(mapStateToProps)(({ dispatch, accessToken }: ILoginProps) => {
	const [name, setName] = useState<string | null>(null);
	const [password, setPassword] = useState<string | null>(null);
	const [loginError, setLoginError] = useState<string | null>(null);

	const { loginAPI } = useContext(APIContext);

	const onClickLogin = (e: React.FormEvent<HTMLFormElement>) => {
		if (name && password) {
			e.preventDefault();

			dispatch(login(loginAPI, name, password))
				.catch((err) => {
					if (isAxiosError(err) && err.response.status === 401) {
						setLoginError('Name-Passwort Kombination falsch');
					} else {
						setLoginError('Unbekannter Fehler ist aufgetreten');
					}
				})
		}
	}

	if (accessToken.length > 0) {
		return <Redirect to="/sheets" />;
	}

	return (
		<LoginWrapper>
			<LoginModal>
				<Avatar>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5" style={{ marginTop: 8 }}>Anmelden</Typography>
				<form onSubmit={onClickLogin} style={{ width: '100%' }}>
					<FormControl margin="normal" required fullWidth error={name !== null && !isValidName(name)}>
						<InputLabel htmlFor="name">Name</InputLabel>
						<Input id="name" name="name" autoFocus onChange={(e) => setName(e.target.value)} />
					</FormControl>
					<FormControl margin="normal" required fullWidth error={(password !== null && !isValidPassword(password)) || loginError !== null}>
						<InputLabel htmlFor="password">Password</InputLabel>
						<Input
							name="password"
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						{loginError && <ErrorHint>{loginError}</ErrorHint>}
					</FormControl>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={!isValidName(name) || !isValidPassword(password)}
						style={{ marginTop: 20 }}
					>
						Anmelden
          		</Button>
				</form>
			</LoginModal>
		</LoginWrapper>
	);
});