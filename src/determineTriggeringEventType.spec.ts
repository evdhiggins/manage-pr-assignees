import { determineTriggeringEventType } from './determineTriggeringEventType';

describe(determineTriggeringEventType.name, () => {
    test(`Return "pr-opened" for an action/event associated with a new pr`, () => {
        const eventName = `pull_request`;
        const action = `opened`;
        const result = determineTriggeringEventType({ eventName, payload: { action } });
        expect(result).toBe('pr-opened');
    });

    test(`Return "pr-opened" for an action/event associated with pr that was reopened`, () => {
        const eventName = `pull_request`;
        const action = `reopened`;
        const result = determineTriggeringEventType({ eventName, payload: { action } });
        expect(result).toBe('pr-opened');
    });

    test(`Return "review-requested" for an action/event associated with a requested review`, () => {
        const eventName = `pull_request`;
        const action = `review_requested`;
        const result = determineTriggeringEventType({ eventName, payload: { action } });
        expect(result).toBe('review-requested');
    });

    test(`Return "review-request-removed" for an action/event associated with a the removal of a review request`, () => {
        const eventName = `pull_request`;
        const action = `review_request_removed`;
        const result = determineTriggeringEventType({ eventName, payload: { action } });
        expect(result).toBe('review-request-removed');
    });

    test(`Return "review-submitted" for an action/event associated with a submitted review`, () => {
        const eventName = `pull_request_review`;
        const action = `submitted`;
        const result = determineTriggeringEventType({ eventName, payload: { action } });
        expect(result).toBe('review-submitted');
    });

    test(`Return "other" for all other action/event combinations`, () => {
        const combinations = [
            ['pull_request', 'assigned'],
            ['pull_request', 'ready_for_review'],
            ['pull_request', ''],
            ['pull_request_review', 'edited'],
            ['pull_request_review', 'dismissed'],
            ['', ''],
        ] as const;

        for (const [eventName, action] of combinations) {
            const result = determineTriggeringEventType({ eventName, payload: { action } });
            expect(result).toBe(`other`);
        }
    });
});
