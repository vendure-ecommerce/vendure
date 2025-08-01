import { VendureConfig } from '@vendure/core';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import stripJsonComments from 'strip-json-comments';
import { register } from 'ts-node';

import { VendureConfigRef } from '../../shared/vendure-config-ref';
import { selectTsConfigFile } from '../../utilities/ast-utils';
import { isRunningInTsNode } from '../../utilities/utils';

export async function loadVendureConfigFile(
    vendureConfig: VendureConfigRef,
    providedTsConfigPath?: string,
): Promise<VendureConfig> {
    await import('dotenv/config');
    if (!isRunningInTsNode()) {
        let tsConfigPath: string;
        if (providedTsConfigPath) {
            tsConfigPath = providedTsConfigPath;
        } else {
            const tsConfigFile = await selectTsConfigFile();
            tsConfigPath = path.join(process.cwd(), tsConfigFile);
        }

        let tsConfigFileContent: string;
        let tsConfigJson: any;

        try {
            tsConfigFileContent = readFileSync(tsConfigPath, 'utf-8');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to read TypeScript config file at ${tsConfigPath}: ${errorMessage}`);
        }

        try {
            tsConfigJson = JSON.parse(stripJsonComments(tsConfigFileContent));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to parse TypeScript config file at ${tsConfigPath}: ${errorMessage}`);
        }

        const compilerOptions = tsConfigJson.compilerOptions;

        register({
            compilerOptions: { ...compilerOptions, moduleResolution: 'NodeNext', module: 'NodeNext' },
            transpileOnly: true,
        });

        if (compilerOptions.paths) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const tsConfigPaths = require('tsconfig-paths');
            tsConfigPaths.register({
                baseUrl: './',
                paths: compilerOptions.paths,
            });
        }
    }
    const exportedVarName = vendureConfig.getConfigObjectVariableName();
    if (!exportedVarName) {
        throw new Error('Could not find the exported variable name in the VendureConfig file');
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(vendureConfig.sourceFile.getFilePath())[exportedVarName];
    return config;
}
