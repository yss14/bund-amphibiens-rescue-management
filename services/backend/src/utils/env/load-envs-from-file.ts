import * as dotenv from 'dotenv';
import { NodeEnv } from './NodeEnv';

export const loadEnvsFromDotenvFile = (environment: NodeEnv) => {
    dotenv.load({
        path: `./${environment}.env`
    });
}