<p align="center">
  <a href="https://github.com/evdhiggins/manage-pr-assignee/actions"><img alt="typescript-action status" src="https://github.com/evdhiggins/manage-pr-assignee/workflows/build-test/badge.svg"></a>
</p>

# Manage PR Assignee(s)

A simple GitHub action that will change the assignees of a PR in two situations:

1. A review is requested from a user
    - All users for which there are outstanding review requests will be assigned to the PR; the PR creator will be unassigned.
2. A review is submitted by a user
    - All other users for which there are outstanding review requests will be assigned to the PR; the PR creator will be assigned to the PR.

## Usage Example

```yml
- uses: evdhiggins/manage-pr-assignee@v1
  with:
      #github access token.
      token: ${{ secrets.GITHUB_TOKEN }}
```
