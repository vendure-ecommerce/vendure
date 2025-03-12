import { AuthProvider } from '@/providers/auth.js';
import { I18nProvider } from '@/providers/i18n-provider.js';
import { ServerConfigProvider } from '@/providers/server-config.js';
import { routeTree } from '@/routeTree.gen.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import React from 'react';

export const queryClient = new QueryClient();

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        auth: undefined!, // This will be set after we wrap the app in an AuthProvider
        queryClient,
    },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <QueryClientProvider client={queryClient}>
                <ServerConfigProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ServerConfigProvider>
            </QueryClientProvider>
        </I18nProvider>
    );
}
