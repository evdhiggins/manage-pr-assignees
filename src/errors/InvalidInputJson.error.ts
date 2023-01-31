export class InvalidInputJsonError extends Error {
    constructor(inputName: string) {
        super(`Unable to parse JSON input for "${inputName}"`);
    }
}
