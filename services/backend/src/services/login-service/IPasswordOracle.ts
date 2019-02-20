export interface IPasswordOracle {
	passwordIsValid(password: string): Promise<boolean>;
}