import { NodeEnv } from "./NodeEnv";

export const __TEST__ = process.env.NODE_ENV === NodeEnv.Testing;
export const __DEV__ = process.env.NODE_ENV === NodeEnv.Testing;
export const __PROD__ = process.env.NODE_ENV === NodeEnv.Production;