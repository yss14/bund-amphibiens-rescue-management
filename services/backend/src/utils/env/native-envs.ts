import { NodeEnv } from "./NodeEnv";

export const isValidNodeEnvironment = (value: string | undefined): value is NodeEnv => Object.values(NodeEnv).includes(value);