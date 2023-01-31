import { determineAssigneesForPrAndThrowIfNoCreator } from './determineAssigneesForPrAndThrowIfNoCreator';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest, User } from './types';

//
//#region Mock values and setup
//

const userOne: User = { login: 'user1' };
const userTwo: User = { login: 'user2' };
const userThree: User = { login: 'user3' };

//#endregion

describe(determineAssigneesForPrAndThrowIfNoCreator.name, () => {
    describe(`When given an event of "pr-opened"`, () => {
        const makeArgWithPrValues = (...args: PrArgs): Arg =>
            makeArg({ pr: makePullRequest(...args), event: 'pr-opened' });

        test(`Return a toAssign array that only contains the given reviewers, if there are any outstanding review requests`, () => {
            const arg = makeArgWithPrValues(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toAssign).toStrictEqual([userOne.login, userTwo.login]);
        });

        test(`If no review requests are outstanding, the PR creator should be assigned to the PR`, () => {
            const arg = makeArgWithPrValues(userOne, null, [userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toAssign).toStrictEqual([userOne.login]);
        });

        test(`If the PR is created by a user included in the assignee substitutions, the substituted user should be assigned`, () => {
            const pr = makePullRequest(userOne, []);
            const result = determineAssigneesForPrAndThrowIfNoCreator({
                pr,
                event: 'pr-opened',
                creatorAssigneeSubstitutions: { [userOne.login]: userTwo.login },
            });
            expect(result.toAssign).toStrictEqual([userTwo.login]);
        });
    });

    describe(`When given an event of "review-requested"`, () => {
        const makeArgWithPrValues = (...args: PrArgs): Arg =>
            makeArg({ pr: makePullRequest(...args), event: 'review-requested' });

        test(`Return a toAssign array that only contains the given reviewers`, () => {
            const arg = makeArgWithPrValues(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toAssign).toStrictEqual([userOne.login, userTwo.login]);
        });

        test(`If the PR creator is currently assigned, they should be contained within the toUnassign array`, () => {
            const arg = makeArgWithPrValues(userOne, [userThree], [userOne]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toUnassign).toStrictEqual([userOne.login]);
        });

        test(`When given no reviewers, toAssign should be an empty array`, () => {
            const arg = makeArgWithPrValues(userOne, null);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toAssign).toStrictEqual([]);
        });
    });

    describe(`When given an event of "review-request-removed"`, () => {
        const makeArgWithPrValues = (...args: PrArgs): Arg =>
            makeArg({ pr: makePullRequest(...args), event: 'review-request-removed' });

        test(`Return a toAssign array that only contains the given reviewers, if there are remaining review requests`, () => {
            const arg = makeArgWithPrValues(userThree, [userOne, userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toAssign).toStrictEqual([userOne.login, userTwo.login]);
        });

        describe(`If no other review requests are outstanding`, () => {
            test(`The PR creator should be assigned to the PR`, () => {
                const arg = makeArgWithPrValues(userOne, null, [userTwo]);
                const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
                expect(result.toAssign).toStrictEqual([userOne.login]);
            });

            test(`If the PR is created by a user included in the assignee substitutions, the substituted user should be assigned`, () => {
                const pr = makePullRequest(userOne, [], [userTwo]);
                const result = determineAssigneesForPrAndThrowIfNoCreator({
                    pr,
                    event: 'review-request-removed',
                    creatorAssigneeSubstitutions: { [userOne.login]: userThree.login },
                });
                expect(result.toAssign).toStrictEqual([userThree.login]);
            });
        });
    });

    describe(`When given an event of "review-submitted"`, () => {
        const makeArgWithPrValues = (...args: PrArgs): Arg =>
            makeArg({ pr: makePullRequest(...args), event: 'review-submitted' });

        test(`Return a toAssign array that contains the reviewers and the pr creator`, () => {
            const arg = makeArgWithPrValues(userThree, [userTwo]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toAssign).toStrictEqual([userTwo.login, userThree.login]);
        });

        test(`Return a toUnassign array that contains any reviewers for whom a review is no longer pending`, () => {
            const arg = makeArgWithPrValues(userThree, [userTwo], [userOne]);
            const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
            expect(result.toUnassign).toStrictEqual([userOne.login]);
        });

        describe(`If no other review requests are outstanding`, () => {
            test(`The toAssign array should only contain the pr creator`, () => {
                const arg = makeArgWithPrValues(userOne, null);
                const result = determineAssigneesForPrAndThrowIfNoCreator(arg);
                expect(result.toAssign).toStrictEqual([userOne.login]);
            });

            test(`If the PR is created by a user included in the assignee substitutions, the substituted user should be assigned`, () => {
                const pr = makePullRequest(userOne, [], [userTwo]);
                const result = determineAssigneesForPrAndThrowIfNoCreator({
                    pr,
                    event: 'review-submitted',
                    creatorAssigneeSubstitutions: { [userOne.login]: userThree.login },
                });
                expect(result.toAssign).toStrictEqual([userThree.login]);
            });
        });
    });

    test(`Throw an error if no PR pr creator is available`, () => {
        const pr = makePullRequest(null, [userTwo]);
        const arg: Arg = { pr, event: 'review-submitted', creatorAssigneeSubstitutions: {} };
        const fn = () => determineAssigneesForPrAndThrowIfNoCreator(arg);
        expect(fn).toThrowError(NoPullRequestCreatorFoundError);
    });
});

//
// Utils
//

function makePullRequest(
    creator: User | null,
    reviewers: User[] | null,
    currentAssignees: User[] | null = null,
): PullRequest {
    return {
        number: 1,
        user: creator,
        requested_reviewers: reviewers,
        assignees: currentAssignees,
    };
}

type PrArgs = Parameters<typeof makePullRequest>;

type Arg = Parameters<typeof determineAssigneesForPrAndThrowIfNoCreator>[0];

function makeArg(partialArg: Partial<Arg> = {}): Arg {
    return {
        pr: partialArg.pr ?? makePullRequest(userOne, []),
        event: partialArg.event ?? 'pr-opened',
        creatorAssigneeSubstitutions: partialArg.creatorAssigneeSubstitutions ?? {},
    };
}
