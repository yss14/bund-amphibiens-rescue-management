import * as jwt from 'jsonwebtoken';
import { ILoginService } from "./ILoginService";
import { IPasswordOracle } from './IPasswordOracle';

const DAYS_14_IN_SECONDS = 14 * 24 * 60 * 60;

export class LoginService implements ILoginService {
	constructor(
		private readonly privateKey: string,
		private readonly passwordOracle: IPasswordOracle
	) { }

	public passwordIsValid(password: string) {
		return this.passwordOracle.passwordIdValid(password);
	}

	public createAccessToken<T>(payload: T) {
		if (this.isSignableType(payload)) {
			return jwt.sign(payload, this.privateKey, { expiresIn: DAYS_14_IN_SECONDS });
		}

		throw new Error(`Payload of type ${typeof payload} is not suitable for an access token`);
	}

	public accessTokenIsValid(accessToken: string) {
		try {
			jwt.verify(accessToken, this.privateKey);

			return true;
		} catch (err) {
			return false;
		}
	}

	private isSignableType(payload: any): payload is object {
		return payload !== undefined && payload !== null && typeof payload === 'object' && !(payload instanceof Buffer);
	}
}