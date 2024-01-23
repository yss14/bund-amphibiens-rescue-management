import { NodeEnv } from "./NodeEnv";

export const isValidNodeEnvironment = (
  value: string | undefined
): value is NodeEnv =>
  !!value && Object.values(NodeEnv).includes(value as NodeEnv);
