import { VendureConfig } from '@vendure/core';

import { compile, type PathAdapter } from './compiler.js';

type Logger = {
    info: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
    error: (message: string) => void;
};

export type PluginInfo = {
    name: string;
    pluginPath: string;
    dashboardEntryPath: string | undefined;
};

const defaultLogger: Logger = {
    info: (message: string) => {
        /* noop */
    },
    warn: (message: string) => {
        /* noop */
    },
    debug: (message: string) => {
        /* noop */
    },
    error: (message: string) => {
        /* noop */
    },
};

export interface ConfigLoaderOptions {
    vendureConfigPath: string;
    tempDir: string;
    pathAdapter?: PathAdapter;
    vendureConfigExport?: string;
    logger?: Logger;
    reportCompilationErrors?: boolean;
    pluginScanPatterns?: string[];
}

export interface LoadVendureConfigResult {
    vendureConfig: VendureConfig;
    exportedSymbolName: string;
    pluginInfo: PluginInfo[];
}

/**
 * @description
 * This function compiles the given Vendure config file and any imported relative files (i.e.
 * project files, not npm packages) into a temporary directory, and returns the compiled config.
 */
export async function loadVendureConfig(options: ConfigLoaderOptions): Promise<LoadVendureConfigResult> {
    const { vendureConfigPath, tempDir, pathAdapter, logger = defaultLogger, pluginScanPatterns } = options;

    const result = await compile({
        vendureConfigPath,
        outputPath: tempDir,
        pathAdapter,
        logger,
        pluginScanPatterns,
    });

    return result;
}
