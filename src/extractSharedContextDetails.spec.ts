import { MissingSharedContextDetailsError } from './errors';
import {
    extractSharedContextDetails,
    SharedContextDetails,
    ContextInput,
} from './extractSharedContextDetails';

//
//#region Mock values and setup
//

const mockOwnerName = 'repo-owner-name';
const mockRepoName = 'repo-name';
const mockPrNumber = 0;

const expectedOutputForMocks: SharedContextDetails = {
    owner: mockOwnerName,
    repo: mockRepoName,
    pull_number: mockPrNumber,
};

const makeMockInputWithOptionalOverrides = (
    input: { [K in keyof SharedContextDetails]+?: unknown } = {},
): ContextInput =>
    ({
        repo: {
            repo: 'repo' in input ? input.repo : mockRepoName,
            owner: 'owner' in input ? input.owner : mockOwnerName,
        },
        payload: {
            pull_request: { number: 'pull_number' in input ? input.pull_number : mockPrNumber },
        },
        // Intentionally not type-safe for testing purposes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

//#endregion

describe(extractSharedContextDetails.name, () => {
    test(`Return the expected context details if all are provided`, () => {
        const input = makeMockInputWithOptionalOverrides();
        const result = extractSharedContextDetails(input);
        expect(result).toStrictEqual(expectedOutputForMocks);
    });

    describe(`Throw an error when...`, () => {
        test(`The owner name is missing or empty`, () => {
            const invalidOwnerNameValues = [undefined, null, ''];

            for (const value of invalidOwnerNameValues) {
                const input = makeMockInputWithOptionalOverrides({ owner: value });
                const fn = (): SharedContextDetails => extractSharedContextDetails(input);
                expect(fn).toThrowError(MissingSharedContextDetailsError);
            }
        });

        test(`The repo name is missing or empty`, () => {
            const invalidRepoNameValues = [undefined, null, ''];

            for (const value of invalidRepoNameValues) {
                const input = makeMockInputWithOptionalOverrides({ repo: value });
                const fn = (): SharedContextDetails => extractSharedContextDetails(input);
                expect(fn).toThrowError(MissingSharedContextDetailsError);
            }
        });

        test(`The pr number is missing`, () => {
            const invalidPrNumberValues = [undefined, null];

            for (const value of invalidPrNumberValues) {
                const input = makeMockInputWithOptionalOverrides({ pull_number: value });
                const fn = (): SharedContextDetails => extractSharedContextDetails(input);
                expect(fn).toThrowError(MissingSharedContextDetailsError);
            }
        });
    });
});
