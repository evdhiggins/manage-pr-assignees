import { getCreatorAssigneeSubstitutionsAndThrowIfInvalid } from './getCreatorAssigneeSubstitutionsAndThrowIfInvalid';
import { CoreGetInput } from './types';

describe(getCreatorAssigneeSubstitutionsAndThrowIfInvalid.name, () => {
    test(`Return the expected record if given a valid input`, () => {
        const payload = { dependabot: 'repo-owner' };
        const input = JSON.stringify(payload);
        const result = getCreatorAssigneeSubstitutionsAndThrowIfInvalid(makeCoreForInput(input));
        expect(result).toStrictEqual(payload);
    });

    test(`Return an empty object if no substitutions input is available`, () => {
        const result = getCreatorAssigneeSubstitutionsAndThrowIfInvalid(makeCoreForInput(''));
        expect(result).toStrictEqual({});
    });

    describe(`Throw an error when...`, () => {
        type Case = { description: string; json: string } | { description: string; input: unknown };
        const cases: Case[] = [
            { description: `invalid JSON`, json: '}}' },
            { description: `a number`, input: 123 },
            { description: `an array`, input: [`dependabot`] },
            { description: `null`, input: null },
            { description: `a non Record<string, string> object`, input: { dependabot: true } },
        ];

        for (const c of cases) {
            test(`Given ${c.description}`, () => {
                const json = 'json' in c ? c.json : JSON.stringify(c.input);
                const core = makeCoreForInput(json);
                const fn = () => getCreatorAssigneeSubstitutionsAndThrowIfInvalid(core);
                expect(fn).toThrow();
            });
        }
    });
});

function makeCoreForInput(input: string): CoreGetInput {
    return { getInput: () => input };
}
