const errorMessage = `Required details were missing from the event context: `;

export class MissingSharedContextDetailsError extends Error {
    constructor(missingDetails: string[]) {
        super(errorMessage + missingDetails.join(`, `));
    }
}
