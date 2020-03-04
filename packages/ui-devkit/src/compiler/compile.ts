import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
    copyExtensionModules,
    copyUiDevkit,
    createExtensionsModules,
    deleteExistingExtensionModules,
    isInVendureMonorepo,
    restoreOriginalExtensionsModule,
} from './common';

/**
 * Builds the admin-ui app using the Angular CLI `ng build --prod` command.
 */
/*export function compileAdminUiApp(outputPath: string, extensions: Array<Required<AdminUiExtension>>) {
    const cwd = path.join(__dirname, '..');
    const relativeOutputPath = path.relative(cwd, outputPath);
    return new Promise((resolve, reject) => {
        restoreOriginalExtensionsModule();
        deleteExistingExtensionModules();
        copyExtensionModules(extensions);
        copyUiDevkit();
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
}*/

export function compileAdminUiWithExtensions({
    outputPath,
    watch,
    extensions,
}: {
    outputPath: string;
    watch?: boolean;
    extensions: Array<Required<AdminUiExtension>>;
}) {
    // copy scaffold
    fs.removeSync(outputPath);
    fs.ensureDirSync(outputPath);
    fs.copySync(path.join(__dirname, '../../scaffold'), outputPath);

    // copy source files from admin-ui package
    const adminUiSrc = path.join(__dirname, '../../../admin-ui/library/src');
    const outputSrc = path.join(outputPath, 'src');
    fs.ensureDirSync(outputSrc);
    fs.copySync(adminUiSrc, outputSrc);

    return new Promise((resolve, reject) => {
        const buildProcess = spawn('yarn', ['start'], {
            cwd: outputPath,
            shell: true,
            stdio: 'inherit',
        });

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
    });
}
