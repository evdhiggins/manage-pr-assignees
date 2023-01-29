import { TriggeringEventType } from './determineTriggeringEventType';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest, User } from './types';

export function determineAssigneesForPrAndThrowIfNoCreator(
    pr: PullRequest,
    event: TriggeringEventType,
): { toAssign: string[]; toUnassign: string[] } {
    if (!pr.user) throw new NoPullRequestCreatorFoundError(pr.number);

    const currentlyAssignedUsers = pr.assignees?.map(pluckLogin) ?? [];
    const usersThatShouldBeAssigned = pr.requested_reviewers?.map(pluckLogin) ?? [];

    if (event === 'review-submitted') {
        usersThatShouldBeAssigned.push(pr.user.login);
    }

    /** Return true if a given user login should be unassigned */
    const shouldNotBeAssigned = (login: string): boolean =>
        !usersThatShouldBeAssigned.includes(login);

    /** Return true if a given user login should be assigned (and is not currently) */
    const shouldBeAssigned = (login: string): boolean => !currentlyAssignedUsers.includes(login);

    const toUnassign = currentlyAssignedUsers.filter(shouldNotBeAssigned);
    const toAssign = usersThatShouldBeAssigned.filter(shouldBeAssigned);

    return { toAssign, toUnassign };
}

function pluckLogin(user: User): string {
    return user.login;
}
