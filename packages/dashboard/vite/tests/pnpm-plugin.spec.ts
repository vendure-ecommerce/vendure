import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import tsconfigPaths from 'tsconfig-paths';
import { describe, expect, it } from 'vitest';

import { compile } from '../utils/compiler.js';
import { debugLogger, noopLogger } from '../utils/logger.js';
import { findVendurePluginFiles } from '../utils/plugin-discovery.js';

describe('detecting plugins in pnpm packages', () => {
    it('should detect plugins in pnpm node_modules structure', { timeout: 60_000 }, async () => {
        const tempDir = join(__dirname, './__temp/pnpm-plugin');
        await rm(tempDir, { recursive: true, force: true });
        const nodeModulesRoot = join(__dirname, 'fixtures-pnpm-plugin', 'fake_node_modules');

        tsconfigPaths.register({
            baseUrl: nodeModulesRoot,
            paths: {
                'test-plugin': [join(nodeModulesRoot, 'test-plugin')],
            },
        });

        const result = await compile({
            outputPath: tempDir,
            vendureConfigPath: join(__dirname, 'fixtures-pnpm-plugin', 'vendure-config.ts'),
            logger: process.env.LOG ? debugLogger : noopLogger,
            pluginPackageScanner: {
                nodeModulesRoot,
            },
        });

        expect(result.pluginInfo).toHaveLength(1);
        expect(result.pluginInfo[0].name).toBe('TestPlugin');
        expect(result.pluginInfo[0].dashboardEntryPath).toBe('./dashboard/index.tsx');
        expect(result.pluginInfo[0].sourcePluginPath).toBeUndefined();
        // Plugin found via pnpm symlink
        expect(result.pluginInfo[0].pluginPath).toBe(join(nodeModulesRoot, 'test-plugin', 'index.js'));
    });

    it('should not filter out files in pnpm nested node_modules paths', async () => {
        const nodeModulesRoot = join(__dirname, 'fixtures-pnpm-plugin', 'fake_node_modules');
        const pnpmPath = '.pnpm/test-plugin@1.0.0/node_modules/test-plugin';

        // Directly scan the .pnpm directory to verify files with nested node_modules
        // paths are not filtered out by glob ignore patterns
        const files = await findVendurePluginFiles({
            outputPath: join(__dirname, './__temp/pnpm-ignore-test'),
            vendureConfigPath: join(__dirname, 'fixtures-pnpm-plugin', 'vendure-config.ts'),
            logger: noopLogger,
            nodeModulesRoot,
            packageGlobs: [pnpmPath + '/**/*.js'],
        });

        expect(files).toHaveLength(1);
        expect(files[0]).toContain('.pnpm');
        expect(files[0]).toContain('node_modules/test-plugin');
    });
});
