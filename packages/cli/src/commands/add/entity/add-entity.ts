import { outro, spinner, text } from '@clack/prompts';
import { paramCase } from 'change-case';
import path from 'path';
import { ClassDeclaration } from 'ts-morph';

import { getCustomEntityName, selectPluginClass } from '../../../shared/shared-prompts';
import { createFile, getTsMorphProject } from '../../../utilities/ast-utils';

import { addEntityToPlugin } from './codemods/add-entity-to-plugin/add-entity-to-plugin';

const cancelledMessage = 'Add entity cancelled';

export interface AddEntityTemplateContext {
    entity: {
        className: string;
        fileName: string;
    };
}

export async function addEntity(providedPluginClass?: ClassDeclaration) {
    let pluginClass = providedPluginClass;
    let project = pluginClass?.getProject();
    if (!pluginClass || !project) {
        const projectSpinner = spinner();
        projectSpinner.start('Analyzing project...');
        await new Promise(resolve => setTimeout(resolve, 100));
        project = getTsMorphProject();
        projectSpinner.stop('Project analyzed');
        pluginClass = await selectPluginClass(project, cancelledMessage);
    }
    const customEntityName = await getCustomEntityName(cancelledMessage);
    const context: AddEntityTemplateContext = {
        entity: {
            className: customEntityName,
            fileName: paramCase(customEntityName) + '.entity',
        },
    };

    const entitiesDir = path.join(pluginClass.getSourceFile().getDirectory().getPath(), 'entities');
    const entityFile = createFile(project, path.join(__dirname, 'templates/entity.template.ts'));
    entityFile.move(path.join(entitiesDir, `${context.entity.fileName}.ts`));
    entityFile.getClasses()[0].rename(`${context.entity.className}CustomFields`);
    entityFile.getClasses()[1].rename(context.entity.className);

    addEntityToPlugin(pluginClass, entityFile);

    project.saveSync();

    if (!providedPluginClass) {
        outro('✅  Done!');
    }
}
