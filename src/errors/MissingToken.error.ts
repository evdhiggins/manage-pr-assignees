export class MissingTokenError extends Error {
    constructor() {
        super(`"token" input was not provided`);
    }
}
