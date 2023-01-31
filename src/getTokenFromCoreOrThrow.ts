import type * as ActionsCore from '@actions/core';
import { MissingTokenError } from './errors';
import { InputKeys } from './inputs';

/** Extract the "token" required input from @actions/core. Throw an error if no token value is found */
export function getTokenFromCoreOrThrow(core: Pick<typeof ActionsCore, 'getInput'>): string {
    const token = core.getInput(InputKeys.Token);
    if (!token) throw new MissingTokenError();
    return token;
}
