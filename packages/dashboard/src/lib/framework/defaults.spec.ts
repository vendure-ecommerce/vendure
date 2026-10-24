import { describe, expect, it } from 'vitest';

import { getDashboardWidget } from './dashboard-widget/widget-extensions.js';
import { registerDefaults } from './defaults.js';

describe('built-in widget defaultSize hints', () => {
    it('carries the designed x/y positions so the tiling layout renders correctly', () => {
        registerDefaults();

        // metrics anchors the top row — unchanged
        expect(getDashboardWidget('metrics-widget')?.defaultSize).toMatchObject({ x: 0, y: 0 });

        // middle row: latest-orders left half, orders-summary right half
        expect(getDashboardWidget('latest-orders-widget')?.defaultSize).toMatchObject({ x: 0, y: 6 });
        expect(getDashboardWidget('orders-summary-widget')?.defaultSize).toMatchObject({ x: 6, y: 6 });

        // bottom row: three 4-wide widgets side by side at y=13
        expect(getDashboardWidget('top-products-widget')?.defaultSize).toMatchObject({ x: 0, y: 13 });
        expect(getDashboardWidget('low-stock-widget')?.defaultSize).toMatchObject({ x: 4, y: 13 });
        expect(getDashboardWidget('latest-customers-widget')?.defaultSize).toMatchObject({ x: 8, y: 13 });
    });
});
