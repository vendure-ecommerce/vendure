import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { spawn } from 'child_process';
import { FSWatcher, watch } from 'chokidar';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
    copyExtensionModules,
    createExtensionsModules,
    deleteExistingExtensionModules,
    getModuleOutputDir,
    isInVendureMonorepo,
    restoreExtensionsModules,
    restoreOriginalExtensionsModule,
} from './common';

export type Watcher = {
    close: () => void;
};

/**
 * Starts the admin ui app in watch mode using the Angular CLI `ng serve` command. Also watches
 * the individual files of any configured extensions and copies them upon change, triggering a
 * rebuild of the Angular app.
 */
export function watchAdminUiApp(extensions: Array<Required<AdminUiExtension>>, port: number): Watcher {
    const cwd = path.join(__dirname, '..');
    restoreExtensionsModules();
    deleteExistingExtensionModules();
    copyExtensionModules(extensions);
    createExtensionsModules(extensions);

    const config = isInVendureMonorepo() ? 'plugin-dev' : 'plugin';
    const buildProcess = spawn('yarn', ['ng', 'serve', `-c=${config}`, `--port=${port}`], {
        cwd,
        shell: true,
        stdio: 'inherit',
    });

    let watcher: FSWatcher | undefined;
    for (const extension of extensions) {
        if (!watcher) {
            watcher = watch(extension.extensionPath, {
                depth: 4,
                ignored: '**/node_modules/',
            });
        } else {
            watcher.add(extension.extensionPath);
        }
    }

    if (watcher) {
        watcher.on('change', filePath => {
            const extension = extensions.find(e => filePath.includes(e.extensionPath));
            if (extension) {
                const outputDir = getModuleOutputDir(extension);
                const filePart = path.relative(extension.extensionPath, filePath);
                const dest = path.join(outputDir, filePart);
                fs.copyFile(filePath, dest);
            }
        });
    }

    const close = () => {
        if (watcher) {
            watcher.close();
        }
        buildProcess.kill();
        restoreOriginalExtensionsModule();
    };

    process.on('SIGINT', close);
    return { close };
}
