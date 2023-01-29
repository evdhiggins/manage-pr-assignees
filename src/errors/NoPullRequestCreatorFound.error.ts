export class NoPullRequestCreatorFoundError extends Error {
    constructor(prNumber: number) {
        super(`The creator of PR #${prNumber} could be found`);
    }
}
