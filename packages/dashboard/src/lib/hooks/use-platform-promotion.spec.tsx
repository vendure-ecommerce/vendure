import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardPromotionV1 } from '@/vdb/framework/platform-promotion/platform-promotion-types.js';
import { globalRegistry } from '@/vdb/framework/registry/global-registry.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const dashboardPromotion: DashboardPromotionV1 = {
    version: 1,
    navSections: [],
    navItems: [],
    pageBlocks: [],
    actions: [],
    capabilities: [
        {
            key: 'org.accounts',
            tier: 'starter',
            title: 'Company accounts',
            summary: 'Summary',
            benefits: ['One', 'Two', 'Three'],
            cta: 'trial',
        },
    ],
};

async function importWithLicenseGuard(licenseGuardConfigured: boolean) {
    vi.resetModules();
    vi.doMock('virtual:vendure-platform-promotion', () => ({
        dashboardPromotion,
        licenseGuardConfigured,
    }));
    const hook = await import('./use-platform-promotion.js');
    const extensionPoint =
        await import('@/vdb/framework/platform-promotion/platform-granted-capabilities.js');
    return { ...hook, ...extensionPoint };
}

describe('usePlatformPromotion', () => {
    beforeEach(() => {
        const store = globalRegistry.get('platformGrantedCapabilities');
        if (store) {
            store.capabilities = undefined;
        }
    });

    it('License Guard not configured: the granted set is empty and all items are locked at once', async () => {
        const { getPlatformPromotion } = await importWithLicenseGuard(false);

        const state = getPlatformPromotion();
        expect(state.licenseGuardConfigured).toBe(false);
        expect(state.hideAll).toBe(false);
        expect(state.grantedCapabilities.size).toBe(0);
        expect(state.isLocked('org.accounts')).toBe(true);
        expect(state.capabilities.get('org.accounts')?.tier).toBe('starter');
    });

    it('License Guard configured and it reports a granted set: the set is used', async () => {
        const { getPlatformPromotion, setPlatformGrantedCapabilities } = await importWithLicenseGuard(true);

        setPlatformGrantedCapabilities(['org.accounts']);

        const state = getPlatformPromotion();
        expect(state.hideAll).toBe(false);
        expect([...state.grantedCapabilities]).toEqual(['org.accounts']);
        expect(state.isLocked('org.accounts')).toBe(false);
        expect(state.isLocked('quote.requests')).toBe(true);
    });

    it('License Guard configured but it reports nothing: all locked items are hidden', async () => {
        const { getPlatformPromotion } = await importWithLicenseGuard(true);

        const state = getPlatformPromotion();
        expect(state.hideAll).toBe(true);
        expect(state.isLocked('org.accounts')).toBe(false);
    });

    it('renders again when License Guard reports the granted set', async () => {
        const { usePlatformPromotion, setPlatformGrantedCapabilities } = await importWithLicenseGuard(true);
        const states: Array<{ hideAll: boolean; locked: boolean }> = [];
        function Probe() {
            const { hideAll, isLocked } = usePlatformPromotion();
            states.push({ hideAll, locked: isLocked('quote.requests') });
            return null;
        }
        const container = document.createElement('div');
        const root = createRoot(container);

        await act(async () => root.render(<Probe />));
        await act(async () => setPlatformGrantedCapabilities(['org.accounts']));
        await act(async () => root.unmount());

        expect(states[0]).toEqual({ hideAll: true, locked: false });
        expect(states[states.length - 1]).toEqual({ hideAll: false, locked: true });
    });
});
