import { determineTriggeringEventType } from './determineTriggeringEventType';

describe(determineTriggeringEventType.name, () => {
    test(`Return "review-requested" for an action/event associated with a requested review`, () => {
        const eventName = `pull_request`;
        const action = `review_requested`;
        const result = determineTriggeringEventType({ eventName, action });
        expect(result).toBe('review-requested');
    });

    test(`Return "review-submitted" for an action/event associated with a submitted review`, () => {
        const eventName = `pull_request_review`;
        const action = `submitted`;
        const result = determineTriggeringEventType({ eventName, action });
        expect(result).toBe('review-submitted');
    });

    test(`Return "other" for all other action/event combinations`, () => {
        const combinations = [
            ['pull_request', 'assigned'],
            ['pull_request', 'review_request_removed'],
            ['pull_request', ''],
            ['pull_request_review', 'edited'],
            ['pull_request_review', 'dismissed'],
            ['', ''],
        ] as const;

        for (const [eventName, action] of combinations) {
            const result = determineTriggeringEventType({ eventName, action });
            expect(result).toBe(`other`);
        }
    });
});
