import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { compile } from '../utils/compiler.js';
import { debugLogger, noopLogger } from '../utils/logger.js';

describe('handling ESM projects with tsconfig path aliases', () => {
    it('should compile ESM project with path aliases', { timeout: 60_000 }, async () => {
        const tempDir = join(__dirname, './__temp/esm-path-alias');
        await rm(tempDir, { recursive: true, force: true });
        const result = await compile({
            outputPath: tempDir,
            vendureConfigPath: join(__dirname, 'fixtures-esm-path-alias', 'vendure-config.ts'),
            logger: process.env.LOG ? debugLogger : noopLogger,
            module: 'esm',
            pathAdapter: {
                transformTsConfigPathMappings: ({ phase, patterns }) => {
                    // For both compiling and loading phases, we need to strip the fixtures directory prefix
                    // because the compiled output flattens the directory structure
                    return patterns.map(pattern => {
                        let transformed = pattern.replace(/\.\/fixtures-esm-path-alias\//, './');
                        if (phase === 'loading') {
                            transformed = transformed.replace(/.ts$/, '.js');
                        }
                        return transformed;
                    });
                },
            },
        });

        expect(result.pluginInfo).toHaveLength(1);
        expect(result.pluginInfo[0].name).toBe('MyPlugin');
        expect(result.pluginInfo[0].dashboardEntryPath).toBe('./dashboard/index.tsx');
        // sourcePluginPath is undefined because the plugin is discovered from compiled output,
        // not from source analysis (path aliases in source can't be followed without runtime resolution)
        expect(result.pluginInfo[0].sourcePluginPath).toBeUndefined();
        expect(result.pluginInfo[0].pluginPath).toBe(join(tempDir, 'my-plugin', 'src', 'my.plugin.js'));
    });
});
