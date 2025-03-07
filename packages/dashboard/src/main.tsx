import { AuthProvider, useAuth } from '@/auth.js';
import { useDashboardExtensions } from '@/framework/internal/extension-api/use-dashboard-extensions.js';
import UseExtendedRouter from '@/framework/internal/page/use-extended-router.js';
import { defaultLocale, dynamicActivate, I18nProvider } from '@/i18n/i18n-provider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.js';

import '@/framework/defaults.js';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const queryClient = new QueryClient();

function InnerApp() {
    const auth = useAuth();
    const extendedRouter = UseExtendedRouter(router);
    return <RouterProvider router={extendedRouter} context={{ auth }} />;
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
            <I18nProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <InnerApp />
                    </AuthProvider>
                </QueryClientProvider>
            </I18nProvider>
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
