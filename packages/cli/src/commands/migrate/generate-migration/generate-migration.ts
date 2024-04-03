import { cancel, isCancel, log, text } from '@clack/prompts';
import { generateMigration } from '@vendure/core';
import path from 'node:path';
import { register } from 'ts-node';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { analyzeProject } from '../../../shared/shared-prompts';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { isRunningInTsNode } from '../../../utilities/utils';

const cancelledMessage = 'Add entity cancelled';

export interface GenerateMigrationOptions {
    plugin?: VendurePluginRef;
}

export const generateMigrationCommand = new CliCommand({
    id: 'generate-migration',
    category: 'Other',
    description: 'Generate a new database migration',
    run: options => runGenerateMigration(options),
});

async function runGenerateMigration(
    options?: Partial<GenerateMigrationOptions>,
): Promise<CliCommandReturnVal> {
    const project = await analyzeProject({ cancelledMessage });
    const vendureConfig = new VendureConfigRef(project);
    log.info('Using VendureConfig from ' + vendureConfig.getPathRelativeToProjectRoot());

    const name = await text({
        message: 'Enter a meaningful name for the migration',
        initialValue: '',
        placeholder: 'add-custom-fields',
        validate: input => {
            if (!/^[a-zA-Z][a-zA-Z-_0-9]+$/.test(input)) {
                return 'The plugin name must contain only letters, numbers, underscores and dashes';
            }
        },
    });
    if (isCancel(name)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    const config = loadVendureConfigFile(vendureConfig);
    await generateMigration(config, { name, outputDir: './src/migrations' });

    return {
        project,
        modifiedSourceFiles: [],
    };
}

function loadVendureConfigFile(vendureConfig: VendureConfigRef) {
    if (!isRunningInTsNode()) {
        const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const compilerOptions = require(tsConfigPath).compilerOptions;
        register({ compilerOptions });
    }
    const exportedVarName = vendureConfig.getConfigObjectVariableName();
    if (!exportedVarName) {
        throw new Error('Could not find the exported variable name in the VendureConfig file');
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(vendureConfig.sourceFile.getFilePath())[exportedVarName];
    return config;
}
