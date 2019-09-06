import { Injectable } from '@nestjs/common';
import { compileAdminUiApp, watchAdminUiApp, Watcher } from '@vendure/admin-ui/devkit';
import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { Logger } from '@vendure/core';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';

import { loggerCtx, UI_PATH } from './constants';

@Injectable()
export class UiAppCompiler {
    private readonly hashfile = path.join(__dirname, 'modules-hash.txt');

    watchAdminUiApp(extensions: AdminUiExtension[] | undefined, port: number): Watcher {
        const extensionsWithId = this.normalizeExtensions(extensions);
        Logger.info(`Starting Admin UI in Angular dev server on port ${port}`, loggerCtx);
        return watchAdminUiApp(extensionsWithId, port);
    }

    async compileAdminUiApp(extensions: AdminUiExtension[] | undefined): Promise<void> {
        const compiledAppExists = fs.existsSync(path.join(UI_PATH, 'index.html'));
        const extensionsWithId = this.normalizeExtensions(extensions);

        if (!compiledAppExists || this.extensionModulesHaveChanged(extensionsWithId)) {
            Logger.info('Compiling Admin UI with extensions...', loggerCtx);
            await compileAdminUiApp(path.join(__dirname, '../admin-ui'), extensionsWithId);
            Logger.info('Completed compilation!', loggerCtx);
        } else {
            Logger.verbose('Extensions not changed since last run', loggerCtx);
        }
    }

    /**
     * Ensures each extension has an ID. If not defined by the user, a deterministic ID is generated
     * from a hash of the extension config.
     */
    private normalizeExtensions(extensions?: AdminUiExtension[]): Array<Required<AdminUiExtension>> {
        return (extensions || []).map(e => {
            if (e.id) {
                return e as Required<AdminUiExtension>;
            }
            const hash = crypto.createHash('sha256');
            hash.update(JSON.stringify(e));
            const id = hash.digest('hex');
            return { ...e, id };
        });
    }

    /**
     * Checks whether the extensions configuration or any of the extension module files have been
     * changed since the last run.
     */
    private extensionModulesHaveChanged(extensions: Array<Required<AdminUiExtension>>): boolean {
        fs.ensureFileSync(this.hashfile);
        const previousHash = fs.readFileSync(this.hashfile, 'utf-8');
        if (!previousHash && (!extensions || extensions.length === 0)) {
            // No extensions are configured and there is no last has,
            // as when the plugin is newly installed. In this case,
            // it would be unnecessary to recompile.
            return false;
        }
        const currentHash = this.getExtensionModulesHash(extensions);

        if (currentHash === previousHash) {
            return false;
        }
        fs.writeFileSync(this.hashfile, currentHash, 'utf-8');
        return true;
    }

    /**
     * Generates a hash based on the extensions array as well as the modified time of each file
     * in the ngModulesPaths.
     */
    private getExtensionModulesHash(extensions: Array<Required<AdminUiExtension>>): string {
        let modifiedDates: string[] = [];
        for (const extension of extensions) {
            modifiedDates = [...modifiedDates, ...this.getAllModifiedDates(extension.ngModulePath)];
        }
        const hash = crypto.createHash('sha256');
        hash.update(modifiedDates.join('') + JSON.stringify(extensions));
        return hash.digest('hex');
    }

    private getAllModifiedDates(dirPath: string): string[] {
        const modifiedDates: string[] = [];
        this.visitRecursive(dirPath, filePath => {
            modifiedDates.push(fs.statSync(filePath).mtimeMs.toString());
        });
        return modifiedDates;
    }

    private visitRecursive(dirPath: string, visitor: (filePath: string) => void) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                this.visitRecursive(fullPath, visitor);
            } else {
                visitor(fullPath);
            }
        }
    }
}
