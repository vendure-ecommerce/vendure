import '../src/app/styles.css';

import { registerDefaults } from '@/vdb/framework/defaults.js';
import { AuthProvider } from '@/vdb/providers/auth.js';
import { ChannelProvider } from '@/vdb/providers/channel-provider.js';
import { defaultLocale, dynamicActivate, I18nProvider } from '@/vdb/providers/i18n-provider.js';
import { ServerConfigProvider } from '@/vdb/providers/server-config.js';
import { ThemeProvider } from '@/vdb/providers/theme-provider.js';
import { UserSettingsProvider } from '@/vdb/providers/user-settings.js';
import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DemoAuthProvider } from './demo-auth-provider.js';

const queryClient = new QueryClient();

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
    },
    decorators: [
        Story => {
            useEffect(() => {
                // With this method we dynamically load the catalogs
                void dynamicActivate(defaultLocale);
                registerDefaults();
            }, []);

            return (
                <I18nProvider>
                    <QueryClientProvider client={queryClient}>
                        <UserSettingsProvider queryClient={queryClient}>
                            <ThemeProvider defaultTheme="system">
                                <AuthProvider>
                                    <DemoAuthProvider>
                                        <ServerConfigProvider>
                                            <ChannelProvider>
                                                <Story />
                                            </ChannelProvider>
                                        </ServerConfigProvider>
                                    </DemoAuthProvider>
                                </AuthProvider>
                            </ThemeProvider>
                        </UserSettingsProvider>
                    </QueryClientProvider>
                </I18nProvider>
            );
        },
    ],
};

export default preview;
