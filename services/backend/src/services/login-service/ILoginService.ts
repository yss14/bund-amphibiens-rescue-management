export interface ILoginService {
	passwordIsValid(password: string): Promise<boolean>;
	createAccessToken<T>(payload: T): string;
	accessTokenIsValid(accessToken: string): boolean;
}