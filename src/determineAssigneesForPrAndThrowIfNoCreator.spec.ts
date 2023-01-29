import { determineAssigneesForPrAndThrowIfNoCreator } from './determineAssigneesForPrAndThrowIfNoCreator';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest, User } from './types';

//
//#region Mock values and setup
//

const userOne: User = { login: 'user1' };
const userTwo: User = { login: 'user2' };
const userThree: User = { login: 'user3' };

function makePullRequest(owner: User | null, reviewers: User[] | null): PullRequest {
    return {
        number: 1,
        user: owner,
        requested_reviewers: reviewers,
    };
}

//#endregion

describe(determineAssigneesForPrAndThrowIfNoCreator.name, () => {
    describe(`When given an event of "review-requested"`, () => {
        test(`Return an array that only contains the given reviewers`, () => {
            const pr = makePullRequest(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-requested');
            expect(result).toStrictEqual([userOne.login, userTwo.login]);
        });

        test(`When given no reviewers, return an empty array`, () => {
            const pr = makePullRequest(userOne, null);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-requested');
            expect(result).toStrictEqual([]);
        });
    });

    describe(`When given an event of "review-submitted"`, () => {
        test(`Return an array that contains the reviewers and the owner`, () => {
            const pr = makePullRequest(userThree, [userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
            expect(result).toStrictEqual([userTwo.login, userThree.login]);
        });

        test(`When given no reviewers, return an array only containing the owner`, () => {
            const pr = makePullRequest(userOne, null);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
            expect(result).toStrictEqual([userOne.login]);
        });
    });

    test(`Throw an error if no PR owner / creator is available`, () => {
        const pr = makePullRequest(null, [userTwo]);
        const fn = (): string[] =>
            determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
        expect(fn).toThrowError(NoPullRequestCreatorFoundError);
    });
});
