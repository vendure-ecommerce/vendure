import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { defaultManipulationSettings } from '../../../../../constants';
import { getVendureConfig } from '../../../../../utilities/ast-utils';
import { expectSourceFileContentToMatch } from '../../../../../utilities/testing-utils';

import { updateAdminUiPluginInit } from './update-admin-ui-plugin-init';

describe('updateAdminUiPluginInit', () => {
    it('adds app prop', () => {
        const project = new Project({
            manipulationSettings: defaultManipulationSettings,
        });
        project.addSourceFileAtPath(path.join(__dirname, 'fixtures', 'no-app-prop.fixture.ts'));
        const vendureConfig = getVendureConfig(project, { checkFileName: false });
        updateAdminUiPluginInit(vendureConfig, {
            pluginClassName: 'TestPlugin',
            pluginPath: './plugins/test-plugin/test.plugin',
        });

        expectSourceFileContentToMatch(
            project.getSourceFiles()[0],
            path.join(__dirname, 'fixtures', 'no-app-prop.expected'),
        );
    });

    it('adds to existing ui extensions array', () => {
        const project = new Project({
            manipulationSettings: defaultManipulationSettings,
        });
        project.addSourceFileAtPath(path.join(__dirname, 'fixtures', 'existing-app-prop.fixture.ts'));
        const vendureConfig = getVendureConfig(project, { checkFileName: false });
        updateAdminUiPluginInit(vendureConfig, {
            pluginClassName: 'TestPlugin',
            pluginPath: './plugins/test-plugin/test.plugin',
        });

        expectSourceFileContentToMatch(
            project.getSourceFiles()[0],
            path.join(__dirname, 'fixtures', 'existing-app-prop.expected'),
        );
    });
});
