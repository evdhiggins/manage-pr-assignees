import { InputKeys } from '../inputs';

export class MissingTokenError extends Error {
    constructor() {
        super(`"${InputKeys.Token}" input was not provided`);
    }
}
