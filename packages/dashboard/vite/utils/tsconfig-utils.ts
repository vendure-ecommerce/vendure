import fs from 'fs-extra';
import path from 'path';
import { CompilerOptions } from 'typescript';

import { Logger, TransformTsConfigPathMappingsFn } from '../types.js';

export interface TsConfigPathsConfig {
    baseUrl: string;
    paths: Record<string, string[]>;
}

/**
 * Finds and parses tsconfig files in the given directory and its parent directories.
 */
export async function findTsConfigPaths(
    configPath: string,
    logger: Logger,
    phase: 'compiling' | 'loading',
    transformTsConfigPathMappings: TransformTsConfigPathMappingsFn,
): Promise<TsConfigPathsConfig | undefined> {
    let currentDir = path.dirname(configPath);

    while (currentDir !== path.parse(currentDir).root) {
        try {
            const files = await fs.readdir(currentDir);
            const tsConfigFiles = files.filter(file => /^tsconfig(\..*)?\.json$/.test(file));

            for (const fileName of tsConfigFiles) {
                const tsConfigFilePath = path.join(currentDir, fileName);
                try {
                    const { paths, baseUrl } = await getCompilerOptionsFromFile(tsConfigFilePath);
                    if (paths) {
                        const tsConfigBaseUrl = path.resolve(currentDir, baseUrl || '.');
                        const pathMappings = getTransformedPathMappings(
                            paths,
                            phase,
                            transformTsConfigPathMappings,
                        );
                        return { baseUrl: tsConfigBaseUrl, paths: pathMappings };
                    }
                } catch (e) {
                    logger.warn(
                        `Could not read or parse tsconfig file ${tsConfigFilePath}: ${e instanceof Error ? e.message : String(e)}`,
                    );
                }
            }
        } catch (e) {
            logger.warn(
                `Could not read directory ${currentDir}: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
        currentDir = path.dirname(currentDir);
    }
    return undefined;
}

async function getCompilerOptionsFromFile(tsConfigFilePath: string): Promise<CompilerOptions> {
    const tsConfigContent = await fs.readFile(tsConfigFilePath, 'utf-8');
    const tsConfig = JSON.parse(tsConfigContent);
    return tsConfig.compilerOptions || {};
}

function getTransformedPathMappings(
    paths: Required<CompilerOptions>['paths'],
    phase: 'compiling' | 'loading',
    transformTsConfigPathMappings: TransformTsConfigPathMappingsFn,
) {
    const pathMappings: Record<string, string[]> = {};

    for (const [alias, patterns] of Object.entries(paths)) {
        const normalizedPatterns = patterns.map(pattern => pattern.replace(/\\/g, '/'));
        pathMappings[alias] = transformTsConfigPathMappings({
            phase,
            alias,
            patterns: normalizedPatterns,
        });
    }
    return pathMappings;
}
