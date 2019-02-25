import "@babel/polyfill";
import "./object-values";
import { objectValuesPolyfill } from "./object-values";
require("jspolyfill-array.prototype.find");

export const setupPolyfills = () => {
	objectValuesPolyfill();
}
