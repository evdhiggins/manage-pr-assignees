import { TriggeringEventType } from './determineTriggeringEventType';
import { NoPullRequestCreatorFoundError } from './errors';
import { PullRequest } from './types';

export function determineAssigneesForPrAndThrowIfNoCreator(
    pr: PullRequest,
    event: TriggeringEventType,
): string[] {
    if (!pr.user) throw new NoPullRequestCreatorFoundError(pr.number);
    const assignees = pr.requested_reviewers?.map(r => r.login) ?? [];
    if (event === 'review-submitted') assignees.push(pr.user.login);
    return assignees;
}
