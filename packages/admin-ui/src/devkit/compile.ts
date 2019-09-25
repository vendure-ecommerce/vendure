import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { spawn } from 'child_process';
import * as path from 'path';

import {
    copyExtensionModules,
    createExtensionsModules,
    deleteExistingExtensionModules,
    isInVendureMonorepo,
    restoreOriginalExtensionsModule,
} from './common';

/**
 * Builds the admin-ui app using the Angular CLI `ng build --prod` command.
 */
export function compileAdminUiApp(outputPath: string, extensions: Array<Required<AdminUiExtension>>) {
    const cwd = path.join(__dirname, '..');
    const relativeOutputPath = path.relative(cwd, outputPath);
    return new Promise((resolve, reject) => {
        restoreOriginalExtensionsModule();
        deleteExistingExtensionModules();
        copyExtensionModules(extensions);
        createExtensionsModules(extensions);

        const config = isInVendureMonorepo() ? 'plugin-dev' : 'plugin';
        const buildProcess = spawn(
            'yarn',
            ['ng', 'build', `-c=${config}`, `--outputPath=${relativeOutputPath}`],
            {
                cwd,
                shell: true,
                stdio: 'inherit',
            },
        );
        buildProcess.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(code);
            }
        });
        buildProcess.on('error', err => {
            reject(err);
        });
    }).finally(() => {
        restoreOriginalExtensionsModule();
    });
}
