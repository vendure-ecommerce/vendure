import path from 'node:path';
import { register } from 'ts-node';

import { VendureConfigRef } from '../../shared/vendure-config-ref';
import { selectTsConfigFile } from '../../utilities/ast-utils';
import { isRunningInTsNode } from '../../utilities/utils';

export async function loadVendureConfigFile(vendureConfig: VendureConfigRef) {
    await import('dotenv/config');
    if (!isRunningInTsNode()) {
        const tsConfigPath = await selectTsConfigFile();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const compilerOptions = require(path.join(process.cwd(), tsConfigPath)).compilerOptions;
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
