import { TriggeringEventType } from './determineTriggeringEventType';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest, User } from './types';

export function determineAssigneesForPrAndThrowIfNoCreator(
    pr: PullRequest,
    event: TriggeringEventType,
): { toAssign: string[]; toUnassign: string[] } {
    if (!pr.user) throw new NoPullRequestCreatorFoundError(pr.number);

    const currentlyAssignedUsers = pr.assignees?.map(pluckLogin) ?? [];
    const usersWithPendingReviewRequests = pr.requested_reviewers?.map(pluckLogin) ?? [];

    /** Return true if a given user login should be unassigned */
    const shouldNotBeAssigned = (login: string): boolean =>
        !usersWithPendingReviewRequests.includes(login);

    /** Return true if a given user login should be assigned (and is not currently) */
    const shouldBeAssigned = (login: string): boolean => !currentlyAssignedUsers.includes(login);

    const toUnassign = currentlyAssignedUsers.filter(shouldNotBeAssigned);
    const toAssign = usersWithPendingReviewRequests.filter(shouldBeAssigned);

    const isReviewSubmittedEvent = event === 'review-submitted';
    const lastReviewRequestWasRemoved =
        event === 'review-request-removed' && !usersWithPendingReviewRequests.length;

    if (isReviewSubmittedEvent || lastReviewRequestWasRemoved) {
        toAssign.push(pr.user.login);
    }

    return { toAssign, toUnassign };
}

function pluckLogin(user: User): string {
    return user.login;
}
