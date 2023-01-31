import { InvalidInputJsonError } from './errors';
import { isNotSet, isSet, parseJsonFromInputOrThrowError } from './util';

describe(isSet.name, () => {
    test(`Return "true" when given a value that is not null or undefined`, () => {
        expect(isSet('')).toBeTruthy();
        expect(isSet(0)).toBeTruthy();
    });

    test(`Return "false" when given null`, () => {
        expect(isSet(null)).toBeFalsy();
    });

    test(`Return "false" when given undefined`, () => {
        expect(isSet(undefined)).toBeFalsy();
    });
});

describe(isNotSet.name, () => {
    test(`Return "false" when given a value that is not null or undefined`, () => {
        expect(isNotSet('')).toBeFalsy();
        expect(isNotSet(0)).toBeFalsy();
    });

    test(`Return "true" when given null`, () => {
        expect(isNotSet(null)).toBeTruthy();
    });

    test(`Return "true" when given undefined`, () => {
        expect(isNotSet(undefined)).toBeTruthy();
    });
});

describe(parseJsonFromInputOrThrowError.name, () => {
    test(`Return parsed JSON if given a valid JSON string`, () => {
        const payload = { key: 'value' };
        const input = JSON.stringify(payload);
        const result = parseJsonFromInputOrThrowError(input, 'Token');
        expect(result).toStrictEqual(payload);
    });

    test(`Throw an InvalidInputJsonError if given an invalid payload`, () => {
        const input = '}}';
        const fn = (): unknown => parseJsonFromInputOrThrowError(input, 'Token');
        expect(fn).toThrowError(InvalidInputJsonError);
    });
});
