export interface IPasswordOracle {
	passwordIdValid(password: string): Promise<boolean>;
}