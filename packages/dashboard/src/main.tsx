import { AuthProvider, useAuth } from '@/auth.js';
import { defaultLocale, dynamicActivate, I18nProvider } from '@/i18n/i18n-provider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import '@/framework/defaults.js';
import { routeTree } from './routeTree.gen';
import './styles.css';
import { runDashboardExtensions } from 'virtual:dashboard-extensions';

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient();

function InnerApp() {
    const auth = useAuth();
    return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
    const [i18nLoaded, setI18nLoaded] = React.useState(false);
    useEffect(() => {
        // With this method we dynamically load the catalogs
        dynamicActivate(defaultLocale, () => {
            setI18nLoaded(true);
        });
        runDashboardExtensions();
    }, []);
    return (
        i18nLoaded && (
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
