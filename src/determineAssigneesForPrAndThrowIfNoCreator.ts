import { TriggeringEventType } from './determineTriggeringEventType';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest, User } from './types';

export function determineAssigneesForPrAndThrowIfNoCreator({
    pr,
    event,
    creatorAssigneeSubstitutions,
}: {
    pr: PullRequest;
    event: TriggeringEventType;
    creatorAssigneeSubstitutions: Record<string, string>;
}): { toAssign: string[]; toUnassign: string[] } {
    if (!pr.user) throw new NoPullRequestCreatorFoundError(pr.number);

    const effectivePrCreator =
        pr.user.login in creatorAssigneeSubstitutions
            ? creatorAssigneeSubstitutions[pr.user.login]
            : pr.user.login;
    const currentlyAssignedUsers = pr.assignees?.map(pluckLogin) ?? [];
    const usersWithPendingReviewRequests = pr.requested_reviewers?.map(pluckLogin) ?? [];
    const isReviewRequestedEvent = event === 'review-requested';

    /** Return true if a given user login should be unassigned */
    const shouldNotBeAssigned = (login: string): boolean =>
        !usersWithPendingReviewRequests.includes(login) &&
        // Only automatically un-assign PR creator when a review is requested
        (isReviewRequestedEvent || login !== effectivePrCreator);

    /** Return true if a given user login should be assigned (and is not currently) */
    const shouldBeAssigned = (login: string): boolean => !currentlyAssignedUsers.includes(login);

    const toUnassign = currentlyAssignedUsers.filter(shouldNotBeAssigned);
    const toAssign = usersWithPendingReviewRequests.filter(shouldBeAssigned);

    const isReviewSubmittedNotApprovedEvent = event === 'review-submitted-not-approved';
    const noOutstandingReviewRequestsRemain = usersWithPendingReviewRequests.length === 0;
    const prCreatorIsAlreadyAssigned = currentlyAssignedUsers.includes(effectivePrCreator);

    if (
        (isReviewSubmittedNotApprovedEvent || noOutstandingReviewRequestsRemain) &&
        !prCreatorIsAlreadyAssigned
    ) {
        toAssign.push(effectivePrCreator);
    }

    return { toAssign, toUnassign };
}

function pluckLogin(user: User): string {
    return user.login;
}
