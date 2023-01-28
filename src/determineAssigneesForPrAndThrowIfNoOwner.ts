import { TriggeringEventType } from './determineTriggeringEventType';
import { NoPrOwnerFoundError } from './errors';
import { PullRequest } from './types';

export function determineAssigneesForPrAndThrowIfNoOwner(
    pr: PullRequest,
    event: TriggeringEventType,
): string[] {
    if (!pr.user) throw new NoPrOwnerFoundError(pr.number);
    const assignees = pr.requested_reviewers?.map(r => r.login) ?? [];
    if (event === 'review-submitted') assignees.push(pr.user.login);
    return assignees;
}
