import { cancel, isCancel, log, multiselect, select, spinner, text } from '@clack/prompts';
import { unique } from '@vendure/common/lib/unique';
import { generateMigration, VendureConfig } from '@vendure/core';
import * as fs from 'fs-extra';
import path from 'path';

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
    const { project, tsConfigPath } = await analyzeProject({ cancelledMessage });
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
    const config = await loadVendureConfigFile(vendureConfig, tsConfigPath);

    const migrationsDirs = getMigrationsDir(vendureConfig, config);
    let migrationDir = migrationsDirs[0];

    if (migrationsDirs.length > 1) {
        const migrationDirSelect = await select({
            message: 'Migration file location',
            options: migrationsDirs
                .map(c => ({
                    value: c,
                    label: c,
                }))
                .concat({
                    value: 'other',
                    label: 'Other',
                }),
        });
        if (isCancel(migrationDirSelect)) {
            cancel(cancelledMessage);
            process.exit(0);
        }
        migrationDir = migrationDirSelect as string;
    }

    if (migrationsDirs.length === 1 || migrationDir === 'other') {
        const confirmation = await text({
            message: 'Migration file location',
            initialValue: migrationsDirs[0],
            placeholder: '',
        });
        if (isCancel(confirmation)) {
            cancel(cancelledMessage);
            process.exit(0);
        }
        migrationDir = confirmation;
    }

    const migrationSpinner = spinner();
    migrationSpinner.start('Generating migration...');
    const migrationName = await generateMigration(config, { name, outputDir: migrationDir });
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

function getMigrationsDir(vendureConfigRef: VendureConfigRef, config: VendureConfig): string[] {
    const options: string[] = [];
    if (
        Array.isArray(config.dbConnectionOptions.migrations) &&
        config.dbConnectionOptions.migrations.length
    ) {
        const firstEntry = config.dbConnectionOptions.migrations[0];
        if (typeof firstEntry === 'string') {
            options.push(path.dirname(firstEntry));
        }
    }
    const migrationFile = vendureConfigRef.sourceFile
        .getProject()
        .getSourceFiles()
        .find(sf => {
            return sf
                .getClasses()
                .find(c => c.getImplements().find(i => i.getText() === 'MigrationInterface'));
        });
    if (migrationFile) {
        options.push(migrationFile.getDirectory().getPath());
    }
    options.push(path.join(vendureConfigRef.sourceFile.getDirectory().getPath(), '../migrations'));
    return unique(options.map(p => path.normalize(p)));
}
