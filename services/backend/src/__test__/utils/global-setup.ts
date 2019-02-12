import { loadEnvsFromDotenvFile } from "../../utils/env/load-envs-from-file";
import { NodeEnv } from "../../utils/env/NodeEnv";

export default async () => {
	loadEnvsFromDotenvFile(NodeEnv.Testing);
}