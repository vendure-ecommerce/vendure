import { join } from 'path';
import { describe, expect, it } from 'vitest';

import { loadVendureConfig } from '../utils/config-loader.js';

describe('detecting plugins in barrel exports', () => {
    it('should detect plugins in barrel exports', async () => {
        const result = await loadVendureConfig({
            tempDir: join(__dirname, './__temp'),
            vendureConfigPath: join(__dirname, 'barrel-exports', 'vendure-config.ts'),
        });

        expect(result.pluginInfo).toHaveLength(1);
        expect(result.pluginInfo[0].name).toBe('MyPlugin');
        expect(result.pluginInfo[0].dashboardEntryPath).toBe('./dashboard/index.tsx');
    });
});
