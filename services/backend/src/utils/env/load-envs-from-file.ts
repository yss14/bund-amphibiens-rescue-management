/* istanbul ignore next */
import { load } from 'dotenv';
import { NodeEnv } from './NodeEnv';

/* istanbul ignore next */
export const loadEnvsFromDotenvFile = (environment: NodeEnv) => {
	load({
		path: `./${environment}.env`
	});
}