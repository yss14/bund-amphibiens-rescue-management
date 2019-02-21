import { tryParseInt } from "../utils/try-parse";

test('positive number', () => {
	const result = tryParseInt("42", 0);

	expect(result).toBe(42);
});

test('zero', () => {
	const resultPositive = tryParseInt("0", 1);
	const resultNegative = tryParseInt("-0", 1);

	expect(resultPositive).toBe(0);
	expect(resultNegative).toBe(-0);
});

test('negative number', () => {
	const result = tryParseInt("-42", 1);

	expect(result).toBe(-42);
});

test('floating point number', () => {
	const result = tryParseInt("23.67", 1);

	expect(result).toBe(23);
});

test('invalid integer with default value', () => {
	const result = tryParseInt('abcd42', 42);

	expect(result).toBe(42);
});