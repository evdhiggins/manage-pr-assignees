const errorMessage = `"token" input was not provided`;

export class MissingTokenError extends Error {
    constructor() {
        super(errorMessage);
    }
}
