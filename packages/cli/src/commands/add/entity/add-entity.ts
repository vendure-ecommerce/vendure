import { cancel, isCancel, multiselect, spinner, text } from '@clack/prompts';
import { paramCase, pascalCase } from 'change-case';
import path from 'path';
import { ClassDeclaration, SourceFile } from 'ts-morph';

import { pascalCaseRegex } from '../../../constants';
import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { EntityRef } from '../../../shared/entity-ref';
import { analyzeProject, selectPlugin } from '../../../shared/shared-prompts';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { createFile } from '../../../utilities/ast-utils';
import { pauseForPromptDisplay } from '../../../utilities/utils';

import { addEntityToPlugin } from './codemods/add-entity-to-plugin/add-entity-to-plugin';

const cancelledMessage = 'Add entity cancelled';

export interface AddEntityOptions {
    plugin?: VendurePluginRef;
    className: string;
    fileName: string;
    translationFileName: string;
    features: {
        customFields: boolean;
        translatable: boolean;
    };
    config?: string;
    isNonInteractive?: boolean;
}

export const addEntityCommand = new CliCommand({
    id: 'add-entity',
    category: 'Plugin: Entity',
    description: 'Add a new entity to a plugin',
    run: options => addEntity(options),
});

/**
 * Adds a new entity to a Vendure plugin, supporting both interactive and non-interactive CLI modes.
 *
 * If required options are not provided in non-interactive mode, an error is thrown. The function generates entity and translation files as needed, updates the plugin source, and saves project changes.
 *
 * @returns An object containing the updated project, modified source files, and a reference to the newly created entity.
 */
async function addEntity(
    options?: Partial<AddEntityOptions>,
): Promise<CliCommandReturnVal<{ entityRef: EntityRef }>> {
    const providedVendurePlugin = options?.plugin;
    const { project } = await analyzeProject({ providedVendurePlugin, cancelledMessage, config: options?.config });

    // In non-interactive mode with no plugin specified, we cannot proceed
    if (options?.className && !providedVendurePlugin) {
        throw new Error('Plugin must be specified when running in non-interactive mode. Use selectPlugin in interactive mode.');
    }

    const vendurePlugin = providedVendurePlugin ?? (await selectPlugin(project, cancelledMessage));
    const modifiedSourceFiles: SourceFile[] = [];

    const customEntityName = options?.className ?? (await getCustomEntityName(cancelledMessage));

    const context: AddEntityOptions = {
        className: customEntityName,
        fileName: paramCase(customEntityName) + '.entity',
        translationFileName: paramCase(customEntityName) + '-translation.entity',
        features: await getFeatures(options),
        config: options?.config,
    };

    const entitySpinner = spinner();
    entitySpinner.start('Creating entity...');
    await pauseForPromptDisplay();

    const { entityClass, translationClass } = createEntity(vendurePlugin, context);
    addEntityToPlugin(vendurePlugin, entityClass);
    modifiedSourceFiles.push(entityClass.getSourceFile());
    if (context.features.translatable) {
        addEntityToPlugin(vendurePlugin, translationClass);
        modifiedSourceFiles.push(translationClass.getSourceFile());
    }

    entitySpinner.stop('Entity created');

    await project.save();

    return {
        project,
        modifiedSourceFiles,
        entityRef: new EntityRef(entityClass),
    };
}

/**
 * Determines the feature flags for a new entity, either from provided options or by prompting the user.
 *
 * If features are specified in the options, returns them directly. In non-interactive mode with a class name but no features, defaults to enabling custom fields and disabling translatable properties. Otherwise, prompts the user to select features interactively.
 *
 * @returns An object indicating whether custom fields and translatable properties are enabled for the entity.
 */
async function getFeatures(options?: Partial<AddEntityOptions>): Promise<AddEntityOptions['features']> {
    if (options?.features) {
        return options?.features;
    }
    // Default features for non-interactive mode when not specified
    if (options?.className && !options?.features) {
        return {
            customFields: true,
            translatable: false,
        };
    }
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
    return {
        customFields: features.includes('customFields'),
        translatable: features.includes('translatable'),
    };
}

function createEntity(plugin: VendurePluginRef, options: AddEntityOptions) {
    const entitiesDir = path.join(plugin.getPluginDir().getPath(), 'entities');
    const entityFile = createFile(
        plugin.getSourceFile().getProject(),
        path.join(__dirname, 'templates/entity.template.ts'),
        path.join(entitiesDir, `${options.fileName}.ts`),
    );
    const translationFile = createFile(
        plugin.getSourceFile().getProject(),
        path.join(__dirname, 'templates/entity-translation.template.ts'),
        path.join(entitiesDir, `${options.translationFileName}.ts`),
    );

    const entityClass = entityFile.getClass('ScaffoldEntity');
    const customFieldsClass = entityFile.getClass('ScaffoldEntityCustomFields');
    const translationClass = translationFile.getClass('ScaffoldTranslation');
    const translationCustomFieldsClass = translationFile.getClass('ScaffoldEntityCustomFieldsTranslation');

    if (!options.features.customFields) {
        // Remove custom fields from entity
        customFieldsClass?.remove();
        translationCustomFieldsClass?.remove();
        removeCustomFieldsFromClass(entityClass);
        removeCustomFieldsFromClass(translationClass);
    }
    if (!options.features.translatable) {
        // Remove translatable fields from entity
        translationClass?.remove();
        entityClass?.getProperty('localizedName')?.remove();
        entityClass?.getProperty('translations')?.remove();
        removeImplementsFromClass('Translatable', entityClass);
        translationFile.delete();
    } else {
        entityFile
            .getImportDeclaration('./entity-translation.template')
            ?.setModuleSpecifier(`./${options.translationFileName}`);
        translationFile
            .getImportDeclaration('./entity.template')
            ?.setModuleSpecifier(`./${options.fileName}`);
    }

    // Rename the entity classes
    entityClass?.rename(options.className);
    if (!customFieldsClass?.wasForgotten()) {
        customFieldsClass?.rename(`${options.className}CustomFields`);
    }
    if (!translationClass?.wasForgotten()) {
        translationClass?.rename(`${options.className}Translation`);
    }
    if (!translationCustomFieldsClass?.wasForgotten()) {
        translationCustomFieldsClass?.rename(`${options.className}CustomFieldsTranslation`);
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

export async function getCustomEntityName(_cancelledMessage: string) {
    const entityName = await text({
        message: 'What is the name of the custom entity?',
        initialValue: '',
        validate: input => {
            if (!input) {
                return 'The custom entity name cannot be empty';
            }
            if (!pascalCaseRegex.test(input)) {
                return 'The custom entity name must be in PascalCase, e.g. "ProductReview"';
            }
        },
    });
    if (isCancel(entityName)) {
        cancel(_cancelledMessage);
        process.exit(0);
    }
    return pascalCase(entityName);
}
