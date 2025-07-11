import fs from 'fs-extra';
import path from 'path';

import { Logger } from '../types.js';

/**
 * Finds and parses tsconfig files in the given directory and its parent directories.
 */
export async function findTsConfigPaths(
    configPath: string,
    logger: Logger,
    phase: 'compiling' | 'loading',
    transformTsConfigPathMappings: (params: {
        phase: 'compiling' | 'loading';
        alias: string;
        patterns: string[];
    }) => string[],
): Promise<{ baseUrl: string; paths: Record<string, string[]> } | undefined> {
    const configDir = path.dirname(configPath);
    let currentDir = configDir;

    while (currentDir !== path.parse(currentDir).root) {
        try {
            const files = await fs.readdir(currentDir);
            const tsConfigFiles = files.filter(file => /^tsconfig(\..*)?\.json$/.test(file));

            for (const fileName of tsConfigFiles) {
                const tsConfigPath = path.join(currentDir, fileName);
                try {
                    const tsConfigContent = await fs.readFile(tsConfigPath, 'utf-8');
                    const tsConfig = JSON.parse(tsConfigContent);
                    const compilerOptions = tsConfig.compilerOptions || {};

                    if (compilerOptions.paths) {
                        const tsConfigBaseUrl = path.resolve(currentDir, compilerOptions.baseUrl || '.');
                        const paths: Record<string, string[]> = {};

                        for (const [alias, patterns] of Object.entries(compilerOptions.paths)) {
                            const normalizedPatterns = (patterns as string[]).map(pattern =>
                                pattern.replace(/\\/g, '/'),
                            );
                            paths[alias] = transformTsConfigPathMappings({
                                phase,
                                alias,
                                patterns: normalizedPatterns,
                            });
                        }
                        return { baseUrl: tsConfigBaseUrl, paths };
                    }
                } catch (e) {
                    logger.warn(
                        `Could not read or parse tsconfig file ${tsConfigPath}: ${e instanceof Error ? e.message : String(e)}`,
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
