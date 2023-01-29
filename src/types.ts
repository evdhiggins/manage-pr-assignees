/* eslint-disable @typescript-eslint/no-explicit-any */
import * as github from '@actions/github';

/** Extract the type into which a promise will resolve */
export type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

/** Extract the unboxed return type of a function that returns a promise */
export type UnboxPromiseReturnType<T extends (...args: any[]) => Promise<any>> = UnboxPromise<
    ReturnType<T>
>;

/** The full github user type */
export type GithubUser = UnboxPromiseReturnType<typeof fetchUser>['data'];

/** The full github pr type */
export type GithubPullRequest = UnboxPromiseReturnType<typeof fetchPr>['data'];

/** The github user type, picked to only include the fields that we care about */
export type User = Pick<GithubUser, 'login'>;

/** The github pull request type, picked to only include the fields that we care about */
export type PullRequest = Pick<GithubPullRequest, 'number'> & {
    user: User | null;
    requested_reviewers?: User[] | null;
    assignees?: User[] | null;
};

//
// Invalid functions that exist only for type extraction
//

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function fetchUser() {
    return github.getOctokit(``).request(`GET /user`);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function fetchPr() {
    return github.getOctokit(``).request(`GET /repos/{owner}/{repo}/pulls/{pull_number}`);
}
