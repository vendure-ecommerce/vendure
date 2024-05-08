import { intro, isCancel, log, select, spinner } from '@clack/prompts';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { runPromptsForInputDefinitions } from '../../../shared/prompter';
import { analyzeProject } from '../../../shared/shared-prompts';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';
import { addImportsToFile } from '../../../utilities/ast-utils';
import { pauseForPromptDisplay } from '../../../utilities/utils';
import { addApiExtensionCommand } from '../api-extension/add-api-extension';
import { addCodegenCommand } from '../codegen/add-codegen';
import { addEntityCommand } from '../entity/add-entity';
import { addJobQueueCommand } from '../job-queue/add-job-queue';
import { addServiceCommand } from '../service/add-service';
import { addUiExtensionsCommand } from '../ui-extensions/add-ui-extensions';

import { inputDefinitions } from './add-plugin.input-options';
import { generatePlugin } from './add-plugin.service';
import { GeneratePluginOptions } from './types';

export const addPluginCommandInteractive = new CliCommand({
    id: 'plugin',
    category: 'Plugin',
    description: 'Create a new Vendure plugin',
    run: createNewPlugin,
});

const cancelledMessage = 'Plugin setup cancelled.';

export async function createNewPlugin(): Promise<CliCommandReturnVal> {
    intro('Adding a new Vendure plugin!');

    const { project } = await analyzeProject({ cancelledMessage });

    const options = (await runPromptsForInputDefinitions(
        inputDefinitions,
        project,
        cancelledMessage,
    )) as GeneratePluginOptions;

    const { plugin, modifiedSourceFiles } = await generatePlugin(project, options);

    const configSpinner = spinner();
    configSpinner.start('Updating VendureConfig...');
    await pauseForPromptDisplay();
    const vendureConfig = new VendureConfigRef(project);
    vendureConfig.addToPluginsArray(`${plugin.name}.init({})`);
    addImportsToFile(vendureConfig.sourceFile, {
        moduleSpecifier: plugin.getSourceFile(),
        namedImports: [plugin.name],
    });
    await vendureConfig.sourceFile.getProject().save();
    configSpinner.stop('Updated VendureConfig');

    let done = false;
    const followUpCommands = [
        addEntityCommand,
        addServiceCommand,
        addApiExtensionCommand,
        addJobQueueCommand,
        addUiExtensionsCommand,
        addCodegenCommand,
    ];
    let allModifiedSourceFiles = [...modifiedSourceFiles];
    while (!done) {
        const featureType = await select({
            message: `Add features to ${options.name}?`,
            options: [
                { value: 'no', label: "[Finish] No, I'm done!" },
                ...followUpCommands.map(c => ({
                    value: c.id,
                    label: `[${c.category}] ${c.description}`,
                })),
            ],
        });
        if (isCancel(featureType)) {
            done = true;
        }
        if (featureType === 'no') {
            done = true;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const command = followUpCommands.find(c => c.id === featureType)!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            try {
                const result = await command.run({ plugin });
                allModifiedSourceFiles = result.modifiedSourceFiles;
                // We format all modified source files and re-load the
                // project to avoid issues with the project state
                for (const sourceFile of allModifiedSourceFiles) {
                    sourceFile.organizeImports();
                }
            } catch (e: any) {
                log.error(`Error adding feature "${command.id}"`);
                log.error(e.stack);
            }
        }
    }

    return {
        project,
        modifiedSourceFiles: [],
    };
}
