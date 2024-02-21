import fs from 'fs-extra';
import path from 'path';
import { Project, QuoteKind } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import { defaultManipulationSettings } from '../../../../../constants';

import { getVendureConfig } from '../../../../../utilities/utils';

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

        const result = project.getSourceFiles()[0].getText();
        const expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'no-app-prop.expected'), 'utf-8');
        expect(result).toBe(expected);
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

        const result = project.getSourceFiles()[0].getText();
        const expected = fs.readFileSync(
            path.join(__dirname, 'fixtures', 'existing-app-prop.expected'),
            'utf-8',
        );
        expect(result).toBe(expected);
    });
});
