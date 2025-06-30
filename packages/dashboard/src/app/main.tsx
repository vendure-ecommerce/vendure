import { Toaster } from '@/components/ui/sonner.js';
import { registerDefaults } from '@/framework/defaults.js';
import { setCustomFieldsMap } from '@/framework/document-introspection/add-custom-fields.js';
import { executeDashboardExtensionCallbacks } from '@/framework/extension-api/define-dashboard-extension.js';
import { useDashboardExtensions } from '@/framework/extension-api/use-dashboard-extensions.js';
import { useExtendedRouter } from '@/framework/page/use-extended-router.js';
import { useAuth } from '@/hooks/use-auth.js';
import { useServerConfig } from '@/hooks/use-server-config.js';
import { defaultLocale, dynamicActivate } from '@/providers/i18n-provider.js';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { AppProviders, queryClient } from './app-providers.js';
import { routeTree } from './routeTree.gen.js';
import './styles.css';

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    // In case the dashboard gets served from a subpath, we need to set the basepath based on the environment variable
    ...(import.meta.env.BASE_URL ? { basepath: import.meta.env.BASE_URL } : {}),
    context: {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        auth: undefined!, // This will be set after we wrap the app in an AuthProvider
        queryClient,
    },
    defaultErrorComponent: ({ error }: { error: Error }) => <div>Uh Oh!!! {error.message}</div>,
});

function InnerApp() {
    const auth = useAuth();
    const extendedRouter = useExtendedRouter(router);
    const serverConfig = useServerConfig();
    const [hasSetCustomFieldsMap, setHasSetCustomFieldsMap] = React.useState(false);

    useEffect(() => {
        if (!serverConfig) {
            return;
        }
        setCustomFieldsMap(serverConfig.entityCustomFields);
        setHasSetCustomFieldsMap(true);
    }, [serverConfig?.entityCustomFields.length]);

    return (
        <>
            {(hasSetCustomFieldsMap || auth.status === 'unauthenticated') && (
                <RouterProvider router={extendedRouter} context={{ auth, queryClient }} />
            )}
        </>
    );
}

function App() {
    const [i18nLoaded, setI18nLoaded] = React.useState(false);
    const { extensionsLoaded } = useDashboardExtensions();
    useEffect(() => {
        // With this method we dynamically load the catalogs
        dynamicActivate(defaultLocale, () => {
            setI18nLoaded(true);
        });
        registerDefaults();
    }, []);

    useEffect(() => {
        if (extensionsLoaded) {
            executeDashboardExtensionCallbacks();
        }
    }, [extensionsLoaded]);

    return (
        i18nLoaded &&
        extensionsLoaded && (
            <AppProviders>
                <InnerApp />
                <Toaster />
            </AppProviders>
        )
    );
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
