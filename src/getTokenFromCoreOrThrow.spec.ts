import { MissingTokenError } from './errors';
import { getTokenFromCoreOrThrow } from './getTokenFromCoreOrThrow';

describe(getTokenFromCoreOrThrow.name, () => {
    test(`Return the token string if it is not empty`, () => {
        const input = `token-string`;
        const result = getTokenFromCoreOrThrow({ getInput: () => input });
        expect(result).toBe(input);
    });

    test(`Throw an error if the token string is empty`, () => {
        const input = ``;
        const fn = (): string => getTokenFromCoreOrThrow({ getInput: () => input });
        expect(fn).toThrowError(MissingTokenError);
    });
});
