import { determineAssigneesForPrAndThrowIfNoCreator } from './determineAssigneesForPrAndThrowIfNoCreator';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest, User } from './types';

//
//#region Mock values and setup
//

const userOne: User = { login: 'user1' };
const userTwo: User = { login: 'user2' };
const userThree: User = { login: 'user3' };

function makePullRequest(
    owner: User | null,
    reviewers: User[] | null,
    currentAssignees: User[] | null = null,
): PullRequest {
    return {
        number: 1,
        user: owner,
        requested_reviewers: reviewers,
        assignees: currentAssignees,
    };
}

//#endregion

describe(determineAssigneesForPrAndThrowIfNoCreator.name, () => {
    describe(`When given an event of "pr-opened"`, () => {
        test(`Return a toAssign array that only contains the given reviewers, if there are any outstanding review requests`, () => {
            const pr = makePullRequest(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'pr-opened');
            expect(result.toAssign).toStrictEqual([userOne.login, userTwo.login]);
        });

        test(`If no review requests are outstanding, the PR creator should be assigned to the PR`, () => {
            const pr = makePullRequest(userOne, null, [userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'pr-opened');
            expect(result.toAssign).toStrictEqual([userOne.login]);
        });
    });

    describe(`When given an event of "review-requested"`, () => {
        test(`Return a toAssign array that only contains the given reviewers`, () => {
            const pr = makePullRequest(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-requested');
            expect(result.toAssign).toStrictEqual([userOne.login, userTwo.login]);
        });

        test(`If the PR creator is currently assigned, they should be contained within the toUnassign array`, () => {
            const pr = makePullRequest(userOne, [userThree], [userOne]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-requested');
            expect(result.toUnassign).toStrictEqual([userOne.login]);
        });

        test(`When given no reviewers, toAssign should be an empty array`, () => {
            const pr = makePullRequest(userOne, null);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-requested');
            expect(result.toAssign).toStrictEqual([]);
        });
    });

    describe(`When given an event of "review-request-removed"`, () => {
        test(`Return a toAssign array that only contains the given reviewers, if there are remaining review requests`, () => {
            const pr = makePullRequest(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-request-removed');
            expect(result.toAssign).toStrictEqual([userOne.login, userTwo.login]);
        });

        test(`If no other review requests are outstanding, the PR creator should be assigned to the PR`, () => {
            const pr = makePullRequest(userOne, null, [userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-request-removed');
            expect(result.toAssign).toStrictEqual([userOne.login]);
        });
    });

    describe(`When given an event of "review-submitted"`, () => {
        test(`Return a toAssign array that contains the reviewers and the owner`, () => {
            const pr = makePullRequest(userThree, [userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
            expect(result.toAssign).toStrictEqual([userTwo.login, userThree.login]);
        });

        test(`Return a toUnassign array that contains any reviewers for whom a review is no longer pending`, () => {
            const pr = makePullRequest(userThree, [userTwo], [userOne]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
            expect(result.toUnassign).toStrictEqual([userOne.login]);
        });

        test(`When given no reviewers, the toAssign array should only contain the owner`, () => {
            const pr = makePullRequest(userOne, null);
            const result = determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
            expect(result.toAssign).toStrictEqual([userOne.login]);
        });
    });

    test(`Throw an error if no PR owner / creator is available`, () => {
        const pr = makePullRequest(null, [userTwo]);
        const fn = (): unknown =>
            determineAssigneesForPrAndThrowIfNoCreator(pr, 'review-submitted');
        expect(fn).toThrowError(NoPullRequestCreatorFoundError);
    });
});
