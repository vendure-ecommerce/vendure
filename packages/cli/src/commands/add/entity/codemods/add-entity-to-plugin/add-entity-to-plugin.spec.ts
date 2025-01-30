/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path';
import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { defaultManipulationSettings } from '../../../../../constants';
import { VendurePluginRef } from '../../../../../shared/vendure-plugin-ref';
import { createFile, getPluginClasses } from '../../../../../utilities/ast-utils';
import { expectSourceFileContentToMatch } from '../../../../../utilities/testing-utils';

import { addEntityToPlugin } from './add-entity-to-plugin';

describe('addEntityToPlugin', () => {
    function testAddEntityToPlugin(options: { fixtureFileName: string; expectedFileName: string }) {
        const project = new Project({
            manipulationSettings: defaultManipulationSettings,
        });
        project.addSourceFileAtPath(path.join(__dirname, 'fixtures', options.fixtureFileName));
        const pluginClasses = getPluginClasses(project);
        expect(pluginClasses.length).toBe(1);
        const entityTemplatePath = path.join(__dirname, '../../templates/entity.template.ts');
        const entityFile = createFile(
            project,
            entityTemplatePath,
            path.join(__dirname, 'fixtures', 'entity.ts'),
        );
        const entityClass = entityFile.getClass('ScaffoldEntity');
        addEntityToPlugin(new VendurePluginRef(pluginClasses[0]), entityClass!);

        expectSourceFileContentToMatch(
            pluginClasses[0].getSourceFile(),
            path.join(__dirname, 'fixtures', options.expectedFileName),
        );
    }

    it('creates entity prop and imports', () => {
        testAddEntityToPlugin({
            fixtureFileName: 'no-entity-prop.fixture.ts',
            expectedFileName: 'no-entity-prop.expected',
        });
    });

    it('adds to existing entity prop and imports', () => {
        testAddEntityToPlugin({
            fixtureFileName: 'existing-entity-prop.fixture.ts',
            expectedFileName: 'existing-entity-prop.expected',
        });
    });
});
