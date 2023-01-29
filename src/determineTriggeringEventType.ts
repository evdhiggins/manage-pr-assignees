import type { Context } from '@actions/github/lib/context';

export type TriggeringEventType = 'review-requested' | 'review-submitted' | 'other';

type ContextInput = Pick<Context, 'eventName'> & { payload?: { action?: string } };

export function determineTriggeringEventType(context: ContextInput): TriggeringEventType {
    if (isReviewRequested(context)) return 'review-requested';
    if (isReviewSubmitted(context)) return 'review-submitted';
    return 'other';
}

function isReviewRequested({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'review_requested';
}

function isReviewSubmitted({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request_review' && payload?.action === 'submitted';
}
