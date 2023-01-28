import type { Context } from '@actions/github/lib/context';

export type TriggeringEventType = 'review-requested' | 'review-submitted' | 'other';

export function determineTriggeringEventType(
    context: Pick<Context, 'eventName' | 'action'>,
): TriggeringEventType {
    const { eventName, action } = context;
    if (eventName === 'pull_request' && action === 'review_requested') {
        return 'review-requested';
    }
    if (eventName === 'pull_request_review' && action === 'submitted') {
        return 'review-submitted';
    }
    return 'other';
}
