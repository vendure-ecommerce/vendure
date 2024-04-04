import path from 'node:path';
import { register } from 'ts-node';

import { VendureConfigRef } from '../../shared/vendure-config-ref';
import { isRunningInTsNode } from '../../utilities/utils';

export function loadVendureConfigFile(vendureConfig: VendureConfigRef) {
    if (!isRunningInTsNode()) {
        const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const compilerOptions = require(tsConfigPath).compilerOptions;
        register({ compilerOptions, transpileOnly: true });
    }
    const exportedVarName = vendureConfig.getConfigObjectVariableName();
    if (!exportedVarName) {
        throw new Error('Could not find the exported variable name in the VendureConfig file');
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(vendureConfig.sourceFile.getFilePath())[exportedVarName];
    return config;
}
