import type { Context } from '@actions/github/lib/context';

export type TriggeringEventType = 'review-requested' | 'review-submitted' | 'other';

type ContextInput = Pick<Context, 'eventName' | 'action'>;

export function determineTriggeringEventType(context: ContextInput): TriggeringEventType {
    if (isReviewRequested(context)) return 'review-requested';
    if (isReviewSubmitted(context)) return 'review-submitted';
    return 'other';
}

function isReviewRequested({ eventName, action }: ContextInput): boolean {
    return eventName === 'pull_request' && action === 'review_requested';
}

function isReviewSubmitted({ eventName, action }: ContextInput): boolean {
    return eventName === 'pull_request_review' && action === 'submitted';
}
