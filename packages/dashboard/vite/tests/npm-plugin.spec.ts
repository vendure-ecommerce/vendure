import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import tsconfigPaths from 'tsconfig-paths';
import { describe, expect, it } from 'vitest';

import { compile } from '../utils/compiler.js';
import { debugLogger, noopLogger } from '../utils/logger.js';

describe('detecting plugins in npm packages', () => {
    it(
        'should detect plugins in npm packages',
        async () => {
            const tempDir = join(__dirname, './__temp/npm-plugin');
            await rm(tempDir, { recursive: true, force: true });
            const fakeNodeModules = join(__dirname, 'fixtures-npm-plugin', 'fake_node_modules');

            // For this test to work, we need to use tsconfigPaths to point
            // the `test-plugin` package to the `fake_node_modules` directory.
            // This is because the `test-plugin` package is not installed in
            // the `node_modules` directory, but in the `fake_node_modules`
            // directory.
            tsconfigPaths.register({
                baseUrl: fakeNodeModules,
                paths: {
                    'test-plugin': [join(fakeNodeModules, 'test-plugin')],
                },
            });

            const result = await compile({
                outputPath: tempDir,
                vendureConfigPath: join(__dirname, 'fixtures-npm-plugin', 'vendure-config.ts'),
                logger: process.env.LOG ? debugLogger : noopLogger,
                pluginPackageScanner: {
                    nodeModulesRoot: fakeNodeModules,
                },
            });

            expect(result.pluginInfo).toHaveLength(1);
            expect(result.pluginInfo[0].name).toBe('TestPlugin');
            expect(result.pluginInfo[0].dashboardEntryPath).toBe('./dashboard/index.tsx');
            expect(result.pluginInfo[0].sourcePluginPath).toBeUndefined();
            expect(result.pluginInfo[0].pluginPath).toBe(join(fakeNodeModules, 'test-plugin', 'index.js'));
        },
        { timeout: 10_000 },
    );
});
