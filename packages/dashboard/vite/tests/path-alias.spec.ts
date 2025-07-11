import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { loadVendureConfig } from '../utils/config-loader.js';
import { debugLogger } from '../utils/debug-logger.js';

describe('detecting plugins using tsconfig path aliases', () => {
    it(
        'should detect plugins using tsconfig path aliases',
        async () => {
            const tempDir = join(__dirname, './__temp/path-alias');
            await rm(tempDir, { recursive: true, force: true });
            const result = await loadVendureConfig({
                tempDir,
                vendureConfigPath: join(__dirname, 'fixtures-path-alias', 'vendure-config.ts'),
                logger: debugLogger,
            });

            expect(result.pluginInfo).toHaveLength(1);
            expect(result.pluginInfo[0].name).toBe('AliasedPlugin');
            expect(result.pluginInfo[0].dashboardEntryPath).toBe('./dashboard/index.tsx');
            expect(result.pluginInfo[0].sourcePluginPath).toBe(
                join(__dirname, 'fixtures-path-alias', 'aliased-plugin', 'src', 'aliased.plugin.ts'),
            );
            expect(result.pluginInfo[0].pluginPath).toBe(
                join(tempDir, 'aliased-plugin', 'src', 'aliased.plugin.js'),
            );
        },
        { timeout: 10_000 },
    );
});
