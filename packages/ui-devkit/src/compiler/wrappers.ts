import { normalizeString } from '@vendure/common/lib/normalize-string';
import path from 'path';

import { SharedUiProvidersExtension } from './types';

export function uiExtensions(options: { id?: string; files: string | string[] }): SharedUiProvidersExtension {
    const files = Array.isArray(options.files) ? options.files : [options.files];
    return {
        id: options.id || getIdFromFilePath(files[0]),
        sharedProviders: files,
    };
}

function getIdFromFilePath(filePath: string): string {
    const { dir, name } = path.parse(filePath);
    const parts = safelySplitFilePath(dir).slice(-3);
    const id = normalizeString([...parts, name].join('_'), '_');
    return id;
}

function safelySplitFilePath(filePath: string) {
    try {
        const normalizedPath = path.normalize(filePath);
        const directoryParts = normalizedPath.split(path.sep);
        return directoryParts.filter(part => part !== '.' && part !== '..');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('An error occurred while splitting the file path:', error);
        return [];
    }
}
