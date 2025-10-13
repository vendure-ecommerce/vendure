import { AlertsProvider } from '@/vdb/providers/alerts-provider.js';
import { AuthProvider } from '@/vdb/providers/auth.js';
import { ChannelProvider } from '@/vdb/providers/channel-provider.js';
import { I18nProvider } from '@/vdb/providers/i18n-provider.js';
import { ServerConfigProvider } from '@/vdb/providers/server-config.js';
import { ThemeProvider } from '@/vdb/providers/theme-provider.js';
import { UserSettingsProvider } from '@/vdb/providers/user-settings.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <QueryClientProvider client={queryClient}>
                <UserSettingsProvider queryClient={queryClient}>
                    <ThemeProvider defaultTheme="system">
                        <AuthProvider>
                            <ServerConfigProvider>
                                <ChannelProvider>
                                    <AlertsProvider>{children}</AlertsProvider>
                                </ChannelProvider>
                            </ServerConfigProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </UserSettingsProvider>
            </QueryClientProvider>
        </I18nProvider>
    );
}
