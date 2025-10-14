import { log, spinner } from '@clack/prompts';
import { revertLastMigration } from '@vendure/core';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { loadVendureConfigFile } from '../../../shared/load-vendure-config-file';
import { analyzeProject } from '../../../shared/shared-prompts';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';

const cancelledMessage = 'Revert migrations cancelled';

export const revertMigrationCommand = new CliCommand({
    id: 'run-migration',
    category: 'Other',
    description: 'Run any pending database migrations',
    run: () => runRevertMigration(),
});

async function runRevertMigration(): Promise<CliCommandReturnVal> {
    const { project } = await analyzeProject({ cancelledMessage });
    const vendureConfig = new VendureConfigRef(project);
    log.info('Using VendureConfig from ' + vendureConfig.getPathRelativeToProjectRoot());
    const config = await loadVendureConfigFile(vendureConfig);

    const runSpinner = spinner();
    runSpinner.start('Reverting last migration...');
    await revertLastMigration(config);
    runSpinner.stop(`Successfully reverted last migration`);
    return {
        project,
        modifiedSourceFiles: [],
    };
}
