import { InputKeys } from '../inputs';

export class InvalidAssigneeSubstitutionsError extends Error {
    constructor() {
        super(
            `"${InputKeys.AssigneeMap}" input was not valid. Input must be a JSON string of type Record<string, string>`,
        );
    }
}
