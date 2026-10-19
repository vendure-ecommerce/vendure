import { describe, expect, it } from 'vitest';

import { isDashboardPromotionV1 } from './platform-promotion';
import { platformPromotionSnapshot } from './platform-promotion-snapshot';

describe('isDashboardPromotionV1()', () => {
    it('accepts the bundled snapshot', () => {
        expect(isDashboardPromotionV1(platformPromotionSnapshot)).toBe(true);
    });

    it('rejects an unknown version', () => {
        expect(isDashboardPromotionV1({ ...platformPromotionSnapshot, version: 2 })).toBe(false);
    });

    it('rejects a page block with no column', () => {
        const [{ column, ...first }, ...rest] = platformPromotionSnapshot.pageBlocks;
        expect(isDashboardPromotionV1({ ...platformPromotionSnapshot, pageBlocks: [first, ...rest] })).toBe(
            false,
        );
    });

    it('rejects a capability with 2 benefits', () => {
        const [first, ...rest] = platformPromotionSnapshot.capabilities;
        const capabilities = [{ ...first, benefits: first.benefits.slice(0, 2) }, ...rest];
        expect(isDashboardPromotionV1({ ...platformPromotionSnapshot, capabilities })).toBe(false);
    });
});
