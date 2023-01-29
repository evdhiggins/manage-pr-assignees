<p align="center">
  <a href="https://github.com/evdhiggins/manage-pr-assignees/actions"><img alt="typescript-action status" src="https://github.com/evdhiggins/manage-pr-assignees/workflows/build-test/badge.svg"></a>
</p>

# Manage PR Assignee(s)

A simple GitHub action that will change the assignees of a PR in four situations:

1. A new PR is opened or a previously closed PR is reopened
    - If there are any review requests, the users associated with the review requests will be assigned. All other users will be unassigned.
    - If there are not any review requests, the PR creator will be assigned. All other users will be unassigned.
2. A review is requested from a user
    - All users for which there are outstanding review requests will be assigned to the PR.
    - Users who do not have a pending review request (including the PR creator) will be unassigned.
3. A review is submitted by a user
    - All other users for which there are outstanding review requests will be assigned to the PR; the PR creator will be assigned to the PR.
    - Users who are not the PR creator and do not have a pending review request will be unassigned.
4. A pending review request is removed
    - If there are other outstanding review requests, the users associated with the outstanding reviews will be assigned. All other users will be unassigned.
    - If there are not any outstanding review requests, the PR creator will be assigned. All other users will be unassigned.

## Usage Example

```yml
name: Manage assignees based on review request / submission
on:
    pull_request:
        types: [opened, reopened, review_requested, review_request_removed]
    pull_request_review:
        types: [submitted]

jobs:
    assign:
        runs-on: ubuntu-latest
        steps:
            - uses: evdhiggins/manage-pr-assignees@v1
              with:
                  # A github access token with adequate permissions to fetch a PR by number and to change its assignees.
                  token: ${{ secrets.GITHUB_TOKEN }}
```

If you'd like for this action to only change the assignees for a subset of the supported situations, the triggering events / types can be adjusted to only include the desired situations.

e.g. only change assignees when a review is requested or submitted:

```yml
name: Manage assignees based on review request / submission
on:
    pull_request:
        types: [review_requested]
    pull_request_review:
        types: [submitted]
```
