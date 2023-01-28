import type { Context } from '@actions/github/lib/context';
import { MissingSharedContextDetailsError } from './errors';
import { isNotSet } from './util';

export type SharedContextInputs = Pick<Context, 'repo'> & {
    payload: Pick<Context['payload'], 'pull_request'>;
};

export interface SharedContextDetails {
    owner: string;
    repo: string;
    pull_number: number;
}

export function extractSharedContextDetails(context: SharedContextInputs): SharedContextDetails {
    const {
        repo: { owner, repo },
        payload,
    } = context;

    const missingValues: string[] = [];

    if (!owner) {
        missingValues.push(`Repo owner`);
    }
    if (!repo) {
        missingValues.push(`Repo name`);
    }
    if (isNotSet(payload.pull_request?.number)) {
        missingValues.push(`PR number`);
    }

    if (missingValues.length) {
        throw new MissingSharedContextDetailsError(missingValues);
    }

    // The non-null assertion will never result in a null/undefined
    // property access based on the existing error logic
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { owner, repo, pull_number: payload.pull_request!.number };
}
