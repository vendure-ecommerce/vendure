import { AdminUiExtension, Extension } from './types';

const extensionPaths: string[] = [];

export function provideExtensionPaths(extensions: Extension[]) {
    for (const extension of extensions) {
        if ('extensionPath' in extension) {
            registerExtensionPath(extension);
        }
    }
}

export function registerExtensionPath(extension: AdminUiExtension) {
    extensionPaths.push(extension.extensionPath);
}

export function getExtensionPaths() {
    return extensionPaths;
}
