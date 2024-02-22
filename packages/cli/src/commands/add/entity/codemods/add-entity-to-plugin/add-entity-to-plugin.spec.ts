import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { defaultManipulationSettings } from '../../../../../constants';
import { createSourceFileFromTemplate, getPluginClasses } from '../../../../../utilities/ast-utils';

import { addEntityToPlugin } from './add-entity-to-plugin';

describe('addEntityToPlugin', () => {
    it('creates entity prop and imports', () => {
        const project = new Project({
            manipulationSettings: defaultManipulationSettings,
        });
        project.addSourceFileAtPath(path.join(__dirname, 'fixtures', 'no-entity-prop.fixture.ts'));
        const pluginClasses = getPluginClasses(project);
        expect(pluginClasses.length).toBe(1);
        const entityTemplatePath = path.join(__dirname, '../../scaffold/entity.template.ts');
        const entityFile = createSourceFileFromTemplate(project, entityTemplatePath);
        entityFile.move(path.join(__dirname, 'fixtures/entity.ts'));
        addEntityToPlugin(pluginClasses[0], entityFile);

        const result = pluginClasses[0].getSourceFile().getText();
        const expected = fs.readFileSync(
            path.join(__dirname, 'fixtures', 'no-entity-prop.expected'),
            'utf-8',
        );
        expect(result).toBe(expected);
    });

    it('adds to existing entity prop and imports', () => {
        const project = new Project({
            manipulationSettings: defaultManipulationSettings,
        });
        project.addSourceFileAtPath(path.join(__dirname, 'fixtures', 'existing-entity-prop.fixture.ts'));
        const pluginClasses = getPluginClasses(project);
        expect(pluginClasses.length).toBe(1);
        const entityTemplatePath = path.join(__dirname, '../../scaffold/entity.template.ts');
        const entityFile = createSourceFileFromTemplate(project, entityTemplatePath);
        entityFile.move(path.join(__dirname, 'fixtures/entity.ts'));
        addEntityToPlugin(pluginClasses[0], entityFile);

        const result = pluginClasses[0].getSourceFile().getText();
        const expected = fs.readFileSync(
            path.join(__dirname, 'fixtures', 'existing-entity-prop.expected'),
            'utf-8',
        );
        expect(result).toBe(expected);
    });
});
