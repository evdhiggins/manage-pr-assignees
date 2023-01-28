import { isNotSet, isSet } from './util';

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
