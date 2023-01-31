import { InvalidAssigneeSubstitutionsError } from './errors';
import { InputKeys } from './inputs';
import { CoreGetInput } from './types';
import { parseJsonFromInputOrThrowError } from './util';

/** Extract the "token" required input from @actions/core. Throw an error if no token value is found */
export function getCreatorAssigneeSubstitutionsAndThrowIfInvalid(
    core: CoreGetInput,
): Record<string, string> {
    const substitutionsString = core.getInput(InputKeys.AssigneeMap);
    if (!substitutionsString) return {};
    const substitutions = parseJsonFromInputOrThrowError(substitutionsString, 'AssigneeMap');
    return validateSubstitutionsOrThrow(substitutions);
}

function validateSubstitutionsOrThrow(substitutions: unknown): Record<string, string> {
    if (typeof substitutions !== 'object') throw new InvalidAssigneeSubstitutionsError();
    if (Array.isArray(substitutions)) throw new InvalidAssigneeSubstitutionsError();
    if (substitutions === null) throw new InvalidAssigneeSubstitutionsError();

    for (const [key, value] of Object.entries(substitutions))
        if (typeof key !== 'string' || typeof value !== 'string')
            throw new InvalidAssigneeSubstitutionsError();

    return substitutions as Record<string, string>;
}
