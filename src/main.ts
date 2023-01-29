import * as core from '@actions/core';
import * as github from '@actions/github';
import { determineAssigneesForPrAndThrowIfNoCreator } from './determineAssigneesForPrAndThrowIfNoCreator';
import { determineTriggeringEventType } from './determineTriggeringEventType';
import { extractSharedContextDetails } from './extractSharedContextDetails';
import { getTokenFromCoreOrThrow } from './getTokenFromCoreOrThrow';

export async function main(): Promise<void> {
    try {
        const event = determineTriggeringEventType(github.context);
        if (event === 'other') return;

        const token = getTokenFromCoreOrThrow(core);
        const sharedContextDetails = extractSharedContextDetails(github.context);

        const octokit = github.getOctokit(token);
        const prResponse = await octokit.request(`GET /repos/{owner}/{repo}/pulls/{pull_number}`, {
            ...sharedContextDetails,
        });
        const assignees = determineAssigneesForPrAndThrowIfNoCreator(prResponse.data, event);
        await octokit.request(`POST /repos/{owner}/{repo}/issues/{issue_number}/assignees`, {
            ...sharedContextDetails,
            issue_number: sharedContextDetails.pull_number,
            assignees,
        });
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

void main();
