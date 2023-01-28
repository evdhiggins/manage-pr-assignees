import type * as ActionsCore from '@actions/core';
import { MissingTokenError } from './errors';

/** Extract the "token" required input from @actions/core. Throw an error if no token value is found */
export function getTokenFromCoreOrThrow(core: Pick<typeof ActionsCore, 'getInput'>): string {
    const token = core.getInput(`token`);
    if (!token) {
        throw new MissingTokenError();
    }
    return token;
}
