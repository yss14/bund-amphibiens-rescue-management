import { isNumber } from "../typeguards/is-number";
import { isString } from "util";

export const getBucketNumbers = (): number[] => {
	const parsedBucketNumbers = JSON.parse(process.env.REACT_APP_SETTINGS_NUMBER_OF_BUCKETS || '[]');

	if (parsedBucketNumbers instanceof Array) {
		return parsedBucketNumbers.filter(isNumber);
	} else {
		throw new Error('Invalid bucket numbers provided by environment variable REACT_APP_SETTINGS_NUMBER_OF_BUCKETS');
	}
}

export const getAmphibientsLabels = () => {
	const parsedAmphibiensLabels = JSON.parse(process.env.REACT_APP_SETTINGS_AMPHIBIENS_KINDS || '[]');

	if (parsedAmphibiensLabels instanceof Array) {
		return parsedAmphibiensLabels.filter(isString);
	} else {
		throw new Error('Invalid bucket numbers provided by environment variable REACT_APP_SETTINGS_AMPHIBIENS_KINDS');
	}
}