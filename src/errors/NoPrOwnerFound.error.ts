export class NoPrOwnerFoundError extends Error {
    constructor(prNumber: number) {
        super(`No owner/creator for PR #${prNumber} could be found`);
    }
}
