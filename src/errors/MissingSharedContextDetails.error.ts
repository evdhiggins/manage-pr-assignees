export class MissingSharedContextDetailsError extends Error {
    constructor(missingDetails: string[]) {
        super(`Required details were missing from the event context: ` + missingDetails.join(`, `));
    }
}
