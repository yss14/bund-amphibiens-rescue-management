import * as argon2 from 'argon2';
import { IPasswordOracle } from "./IPasswordOracle";

export class SinglePasswordOracle implements IPasswordOracle {
	private passwordHash: string;

	constructor() {
		this.passwordHash = '';
	}

	public passwordIsValid(password: string): Promise<boolean> {
		return argon2.verify(this.passwordHash, password);
	}

	public async setPassword(password: string): Promise<void> {
		this.passwordHash = await argon2.hash(password);
	}
}