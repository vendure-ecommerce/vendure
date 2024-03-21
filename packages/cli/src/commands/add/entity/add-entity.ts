import { outro } from '@clack/prompts';
import { paramCase } from 'change-case';
import path from 'path';

import { analyzeProject, getCustomEntityName, selectPlugin } from '../../../shared/shared-prompts';
import { createFile } from '../../../utilities/ast-utils';
import { VendurePluginDeclaration } from '../../../utilities/vendure-plugin-declaration';

import { addEntityToPlugin } from './codemods/add-entity-to-plugin/add-entity-to-plugin';

const cancelledMessage = 'Add entity cancelled';

export interface AddEntityTemplateContext {
    entity: {
        className: string;
        fileName: string;
    };
}

export async function addEntity(providedVendurePlugin?: VendurePluginDeclaration) {
    const project = await analyzeProject({ providedVendurePlugin, cancelledMessage });
    const vendurePlugin = providedVendurePlugin ?? (await selectPlugin(project, cancelledMessage));

    const customEntityName = await getCustomEntityName(cancelledMessage);
    const context: AddEntityTemplateContext = {
        entity: {
            className: customEntityName,
            fileName: paramCase(customEntityName) + '.entity',
        },
    };

    const entitiesDir = path.join(vendurePlugin.getPluginDir().getPath(), 'entities');
    const entityFile = createFile(project, path.join(__dirname, 'templates/entity.template.ts'));
    entityFile.move(path.join(entitiesDir, `${context.entity.fileName}.ts`));
    entityFile.getClasses()[0].rename(`${context.entity.className}CustomFields`);
    entityFile.getClasses()[1].rename(context.entity.className);

    addEntityToPlugin(vendurePlugin.classDeclaration, entityFile);

    project.saveSync();

    if (!providedVendurePlugin) {
        outro('✅  Done!');
    }
}
