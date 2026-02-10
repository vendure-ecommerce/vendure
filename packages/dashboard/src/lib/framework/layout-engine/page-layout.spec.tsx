import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PageBlock, PageLayout } from './page-layout.js';
import { registerDashboardPageBlock } from './layout-extensions.js';
import { PageContext } from './page-provider.js';
import { globalRegistry } from '../registry/global-registry.js';
import { UserSettingsContext, type UserSettingsContextType } from '../../providers/user-settings.js';

const useMediaQueryMock = vi.hoisted(() => vi.fn());
const useCopyToClipboardMock = vi.hoisted(() => vi.fn(() => [null, vi.fn()]));

vi.mock('@uidotdev/usehooks', () => ({
    useMediaQuery: useMediaQueryMock,
    useCopyToClipboard: useCopyToClipboardMock,
}));

function registerBlock(
    id: string,
    order: 'before' | 'after' | 'replace',
    pageId = 'customer-list',
): void {
    registerDashboardPageBlock({
        id,
        title: id,
        location: {
            pageId,
            column: 'main',
            position: { blockId: 'list-table', order },
        },
        component: ({ context }) => <div data-testid={`page-block-${id}`}>{context.pageId}</div>,
});
}

function renderPageLayout(children: React.ReactNode, { isDesktop = true } = {}) {
    useMediaQueryMock.mockReturnValue(isDesktop);
    const noop = () => undefined;
    const contextValue = {
        settings: {
            displayLanguage: 'en',
            contentLanguage: 'en',
            theme: 'system',
            displayUiExtensionPoints: false,
            mainNavExpanded: true,
            activeChannelId: '',
            devMode: false,
            hasSeenOnboarding: false,
            tableSettings: {},
        },
        settingsStoreIsAvailable: true,
        setDisplayLanguage: noop,
        setDisplayLocale: noop,
        setContentLanguage: noop,
        setTheme: noop,
        setDisplayUiExtensionPoints: noop,
        setMainNavExpanded: noop,
        setActiveChannelId: noop,
        setDevMode: noop,
        setHasSeenOnboarding: noop,
        setTableSettings: () => undefined,
        setWidgetLayout: noop,
    } as UserSettingsContextType;

    return renderToStaticMarkup(
        <UserSettingsContext.Provider value={contextValue}>
            <PageContext.Provider value={{ pageId: 'customer-list' }}>
                <PageLayout>{children}</PageLayout>
            </PageContext.Provider>
        </UserSettingsContext.Provider>,
    );
}

function getRenderedBlockIds(markup: string) {
    return Array.from(markup.matchAll(/data-testid="(page-block-[^"]+)"/g)).map(match => match[1]);
}

describe('PageLayout', () => {
    beforeEach(() => {
        useMediaQueryMock.mockReset();
        useCopyToClipboardMock.mockReset();
        useCopyToClipboardMock.mockReturnValue([null, vi.fn()]);
        const pageBlockRegistry = globalRegistry.get('dashboardPageBlockRegistry');
        pageBlockRegistry.clear();
    });

    it('renders multiple before/after extension blocks in registration order', () => {
        registerBlock('before-1', 'before');
        registerBlock('before-2', 'before');
        registerBlock('after-1', 'after');

        const markup = renderPageLayout(
            <PageBlock column="main" blockId="list-table">
        <div data-testid="page-block-original">original</div>
            </PageBlock>,
        { isDesktop: true },
    );

        expect(getRenderedBlockIds(markup)).toEqual([
            'page-block-before-1',
            'page-block-before-2',
            'page-block-original',
            'page-block-after-1',
        ]);
    });

    it('replaces original block when replacement extensions are registered', () => {
        registerBlock('replacement-1', 'replace');
        registerBlock('replacement-2', 'replace');

        const markup = renderPageLayout(
            <PageBlock column="main" blockId="list-table">
        <div data-testid="page-block-original">original</div>
            </PageBlock>,
        { isDesktop: true },
    );

        expect(getRenderedBlockIds(markup)).toEqual(['page-block-replacement-1', 'page-block-replacement-2']);
    });

    it('renders extension blocks in mobile layout', () => {
        registerBlock('before-mobile', 'before');
        registerBlock('after-mobile', 'after');

        const markup = renderPageLayout(
            <PageBlock column="main" blockId="list-table">
        <div data-testid="page-block-original">original</div>
            </PageBlock>,
        { isDesktop: false },
    );

        expect(getRenderedBlockIds(markup)).toEqual([
            'page-block-before-mobile',
            'page-block-original',
            'page-block-after-mobile',
        ]);
    });
});
