import type { Context } from '@actions/github/lib/context';

export type TriggeringEventType =
    | 'review-requested'
    | 'review-request-removed'
    | 'review-submitted'
    | 'other';

type ContextInput = Pick<Context, 'eventName'> & { payload?: { action?: string } };

export function determineTriggeringEventType(context: ContextInput): TriggeringEventType {
    if (isReviewRequested(context)) return 'review-requested';
    if (isReviewRequestRemoval(context)) return 'review-request-removed';
    if (isReviewSubmitted(context)) return 'review-submitted';
    return 'other';
}

function isReviewRequested({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'review_requested';
}

function isReviewRequestRemoval({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'review_request_removed';
}

function isReviewSubmitted({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request_review' && payload?.action === 'submitted';
}
