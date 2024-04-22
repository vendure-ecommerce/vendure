import { cancel, isCancel, log, spinner, text } from '@clack/prompts';
import { generateMigration } from '@bb-vendure/core';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { analyzeProject } from '../../../shared/shared-prompts';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';
import { loadVendureConfigFile } from '../load-vendure-config-file';

const cancelledMessage = 'Generate migration cancelled';

export const generateMigrationCommand = new CliCommand({
    id: 'generate-migration',
    category: 'Other',
    description: 'Generate a new database migration',
    run: () => runGenerateMigration(),
});

async function runGenerateMigration(): Promise<CliCommandReturnVal> {
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
    const migrationSpinner = spinner();
    migrationSpinner.start('Generating migration...');
    const migrationName = await generateMigration(config, { name, outputDir: './src/migrations' });
    const report =
        typeof migrationName === 'string'
            ? `New migration generated: ${migrationName}`
            : 'No changes in database schema were found, so no migration was generated';
    migrationSpinner.stop(report);
    return {
        project,
        modifiedSourceFiles: [],
    };
}
