import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { defaultManipulationSettings } from '../../../../../constants';
import { getPluginClasses } from '../../../../../utilities/ast-utils';
import { expectSourceFileContentToMatch } from '../../../../../utilities/testing-utils';

import { addUiExtensionStaticProp } from './add-ui-extension-static-prop';

describe('addUiExtensionStaticProp', () => {
    it('add ui prop and imports', () => {
        const project = new Project({
            manipulationSettings: defaultManipulationSettings,
        });
        project.addSourceFileAtPath(path.join(__dirname, 'fixtures', 'no-ui-prop.fixture.ts'));
        const pluginClasses = getPluginClasses(project);
        expect(pluginClasses.length).toBe(1);
        addUiExtensionStaticProp(pluginClasses[0]);

        expectSourceFileContentToMatch(
            pluginClasses[0].getSourceFile(),
            path.join(__dirname, 'fixtures', 'no-ui-prop.expected'),
        );
    });
});
