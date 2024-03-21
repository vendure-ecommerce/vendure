import { cancel, isCancel, multiselect, outro } from '@clack/prompts';
import { paramCase } from 'change-case';
import path from 'path';
import { ClassDeclaration, StructureKind, SyntaxKind } from 'ts-morph';

import { analyzeProject, getCustomEntityName, selectPlugin } from '../../../shared/shared-prompts';
import { createFile } from '../../../utilities/ast-utils';
import { VendurePluginRef } from '../../../utilities/vendure-plugin-ref';

import { addEntityToPlugin } from './codemods/add-entity-to-plugin/add-entity-to-plugin';

const cancelledMessage = 'Add entity cancelled';

export interface AddEntityTemplateContext {
    entity: {
        className: string;
        fileName: string;
        translationFileName: string;
        features: {
            customFields: boolean;
            translatable: boolean;
        };
    };
}

export async function addEntity(providedVendurePlugin?: VendurePluginRef) {
    const project = await analyzeProject({ providedVendurePlugin, cancelledMessage });
    const vendurePlugin = providedVendurePlugin ?? (await selectPlugin(project, cancelledMessage));

    const customEntityName = await getCustomEntityName(cancelledMessage);

    const features = await multiselect({
        message: 'Entity features (use ↑, ↓, space to select)',
        required: false,
        initialValues: ['customFields'],
        options: [
            {
                label: 'Custom fields',
                value: 'customFields',
                hint: 'Adds support for custom fields on this entity',
            },
            {
                label: 'Translatable',
                value: 'translatable',
                hint: 'Adds support for localized properties on this entity',
            },
        ],
    });
    if (isCancel(features)) {
        cancel(cancelledMessage);
        process.exit(0);
    }

    const context: AddEntityTemplateContext = {
        entity: {
            className: customEntityName,
            fileName: paramCase(customEntityName) + '.entity',
            translationFileName: paramCase(customEntityName) + '-translation.entity',
            features: {
                customFields: features.includes('customFields'),
                translatable: features.includes('translatable'),
            },
        },
    };

    const { entityClass, translationClass } = createEntity(vendurePlugin, context);
    addEntityToPlugin(vendurePlugin, entityClass);
    entityClass.getSourceFile().organizeImports();
    if (context.entity.features.translatable) {
        addEntityToPlugin(vendurePlugin, translationClass);
        translationClass.getSourceFile().organizeImports();
    }

    await project.save();

    if (!providedVendurePlugin) {
        outro('✅  Done!');
    }
}

function createEntity(plugin: VendurePluginRef, context: AddEntityTemplateContext) {
    const entitiesDir = path.join(plugin.getPluginDir().getPath(), 'entities');
    const entityFile = createFile(
        plugin.getSourceFile().getProject(),
        path.join(__dirname, 'templates/entity.template.ts'),
    );
    const translationFile = createFile(
        plugin.getSourceFile().getProject(),
        path.join(__dirname, 'templates/entity-translation.template.ts'),
    );
    entityFile.move(path.join(entitiesDir, `${context.entity.fileName}.ts`));
    translationFile.move(path.join(entitiesDir, `${context.entity.translationFileName}.ts`));

    const entityClass = entityFile.getClass('ScaffoldEntity')?.rename(context.entity.className);
    const customFieldsClass = entityFile
        .getClass('ScaffoldEntityCustomFields')
        ?.rename(`${context.entity.className}CustomFields`);
    const translationClass = translationFile
        .getClass('ScaffoldTranslation')
        ?.rename(`${context.entity.className}Translation`);
    const translationCustomFieldsClass = translationFile
        .getClass('ScaffoldEntityCustomFieldsTranslation')
        ?.rename(`${context.entity.className}CustomFieldsTranslation`);

    if (!context.entity.features.customFields) {
        // Remove custom fields from entity
        customFieldsClass?.remove();
        translationCustomFieldsClass?.remove();
        removeCustomFieldsFromClass(entityClass);
        removeCustomFieldsFromClass(translationClass);
    }
    if (!context.entity.features.translatable) {
        // Remove translatable fields from entity
        translationClass?.remove();
        entityClass?.getProperty('localizedName')?.remove();
        entityClass?.getProperty('translations')?.remove();
        removeImplementsFromClass('Translatable', entityClass);
        translationFile.delete();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { entityClass: entityClass!, translationClass: translationClass! };
}

function removeCustomFieldsFromClass(entityClass?: ClassDeclaration) {
    entityClass?.getProperty('customFields')?.remove();
    removeImplementsFromClass('HasCustomFields', entityClass);
}

function removeImplementsFromClass(implementsName: string, entityClass?: ClassDeclaration) {
    const index = entityClass?.getImplements().findIndex(i => i.getText() === implementsName) ?? -1;
    if (index > -1) {
        entityClass?.removeImplements(index);
    }
}
