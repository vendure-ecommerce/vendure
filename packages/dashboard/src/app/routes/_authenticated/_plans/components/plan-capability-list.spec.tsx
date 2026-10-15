import { PlanCapabilities, PlanCapabilitiesProvider } from '@/vdb/framework/plan/plan-capabilities.js';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OpenConsoleButton, PlanCapabilityList } from './plan-capability-list.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const i18n = setupI18n({ locale: 'en', messages: { en: {} } });

const catalog = {
    offers: [
        {
            displayName: 'Starter',
            headlineCapabilities: [
                {
                    key: 'org.accounts',
                    name: 'Company Accounts',
                    description: 'Buyers share a company account',
                },
            ],
        },
        {
            displayName: 'Growth',
            headlineCapabilities: [
                { key: 'quote.requests', name: 'Quote Requests', description: 'Customers ask for a quote' },
            ],
        },
    ],
};

let container: HTMLDivElement;
let root: Root;
const fetchMock = vi.fn();

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    fetchMock.mockReset();
    vi.unstubAllGlobals();
});

async function renderPage(plan?: PlanCapabilities) {
    const queryClient = new QueryClient();
    let content: ReactNode = (
        <>
            <OpenConsoleButton />
            <PlanCapabilityList />
        </>
    );
    if (plan) {
        content = <PlanCapabilitiesProvider value={plan}>{content}</PlanCapabilitiesProvider>;
    }
    await act(async () => {
        root.render(
            <I18nProvider i18n={i18n}>
                <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
            </I18nProvider>,
        );
    });
    await act(() => vi.waitFor(() => expect(container.textContent).not.toContain('Loading…')));
}

function statusOf(key: string) {
    return container.querySelector(`[data-capability="${key}"]`)?.lastElementChild?.textContent;
}

function consoleHref() {
    return container.querySelector('a')?.getAttribute('href');
}

describe('PlanCapabilityList', () => {
    it('shows every catalog capability as locked when no extension reports granted capabilities', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(catalog)));

        await renderPage();

        expect(container.textContent).toContain('Company Accounts');
        expect(container.textContent).toContain('Growth');
        expect(statusOf('org.accounts')).toBe('Locked');
        expect(statusOf('quote.requests')).toBe('Locked');
        expect(consoleHref()).toBe('https://console.vendure.io/signup');
    });

    it('shows the capabilities that the provider reports as granted', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(catalog)));

        await renderPage({ grantedCapabilities: ['org.accounts'], consoleProjectId: 'project-1' });

        expect(statusOf('org.accounts')).toBe('Granted');
        expect(statusOf('quote.requests')).toBe('Locked');
        expect(consoleHref()).toBe('https://console.vendure.io/projects/project-1/subscription');
    });

    it('links to the Console start page when the provider knows no Console Project', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(catalog)));

        await renderPage({ grantedCapabilities: [] });

        expect(consoleHref()).toBe('https://console.vendure.io');
    });

    it('reads the public catalog with an anonymous request', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(catalog)));

        await renderPage();

        expect(fetchMock).toHaveBeenCalledWith('https://api.vendure.io/v1/catalog', { credentials: 'omit' });
    });

    it('shows a static message when the catalog is not reachable', async () => {
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

        await renderPage();

        expect(container.textContent).toContain('The capability catalog is not available');
        expect(container.querySelector('table')).toBeNull();
        expect(consoleHref()).toBe('https://console.vendure.io/signup');
    });

    it('shows a static message when the catalog answers with an error status', async () => {
        fetchMock.mockResolvedValue(new Response('', { status: 503 }));

        await renderPage();

        expect(container.textContent).toContain('The capability catalog is not available');
    });
});
