import { AppProviders, queryClient, router } from '@/app-providers.js';
import { Toaster } from '@/components/ui/sonner.js';
import { useDashboardExtensions } from '@/framework/extension-api/use-dashboard-extensions.js';
import { useExtendedRouter } from '@/framework/page/use-extended-router.js';
import { defaultLocale, dynamicActivate } from '@/providers/i18n-provider.js';
import { useAuth } from './hooks/use-auth.js';

import '@/framework/defaults.js';
import { RouterProvider } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { setCustomFieldsMap } from './framework/document-introspection/add-custom-fields.js';
import { useServerConfig } from './hooks/use-server-config.js';
import './styles.css';

function InnerApp() {
    const auth = useAuth();
    const extendedRouter = useExtendedRouter(router);
    const serverConfig = useServerConfig();
    useEffect(() => {
        if (!serverConfig) {
            return document;
        }
        setCustomFieldsMap(serverConfig.entityCustomFields);
    }, [serverConfig?.entityCustomFields]);
    return <RouterProvider router={extendedRouter} context={{ auth, queryClient }} />;
}

function App() {
    const [i18nLoaded, setI18nLoaded] = React.useState(false);
    const { extensionsLoaded } = useDashboardExtensions();
    useEffect(() => {
        // With this method we dynamically load the catalogs
        dynamicActivate(defaultLocale, () => {
            setI18nLoaded(true);
        });
    }, []);
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
