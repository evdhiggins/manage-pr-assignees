import type { Context } from '@actions/github/lib/context';

export type TriggeringEventType =
    | 'pr-opened'
    | 'review-requested'
    | 'review-request-removed'
    | 'review-submitted-approved'
    | 'review-submitted-not-approved'
    | 'other';

type ContextInput = Pick<Context, 'eventName'> & {
    payload?: {
        action?: string;
        // State values taken from graphql api docs: https://docs.github.com/en/graphql/reference/enums#pullrequestreviewstate
        review?: { state?: 'approved' | 'changes_requested' | 'commented' };
    };
};

export function determineTriggeringEventType(context: ContextInput): TriggeringEventType {
    if (isPrOpened(context) || isPrReopened(context)) return 'pr-opened';
    if (isReviewRequested(context)) return 'review-requested';
    if (isReviewRequestRemoval(context)) return 'review-request-removed';
    if (isReviewSubmittedApproval(context)) return 'review-submitted-approved';
    if (isReviewSubmitted(context)) return 'review-submitted-not-approved';
    return 'other';
}

function isPrOpened({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'opened';
}

function isPrReopened({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'reopened';
}

function isReviewRequested({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'review_requested';
}

function isReviewRequestRemoval({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request' && payload?.action === 'review_request_removed';
}

function isReviewSubmittedApproval(ctx: ContextInput): boolean {
    return isReviewSubmitted(ctx) && ctx.payload?.review?.state === 'approved';
}

function isReviewSubmitted({ eventName, payload }: ContextInput): boolean {
    return eventName === 'pull_request_review' && payload?.action === 'submitted';
}
