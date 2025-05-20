import { AuthProvider } from '@/providers/auth.js';
import { ChannelProvider } from '@/providers/channel-provider.js';
import { I18nProvider } from '@/providers/i18n-provider.js';
import { ServerConfigProvider } from '@/providers/server-config.js';
import { ThemeProvider } from '@/providers/theme-provider.js';
import { UserSettingsProvider } from '@/providers/user-settings.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

export const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <QueryClientProvider client={queryClient}>
                <UserSettingsProvider>
                    <ThemeProvider defaultTheme="system">
                        <AuthProvider>
                            <ServerConfigProvider>
                                <ChannelProvider>{children}</ChannelProvider>
                            </ServerConfigProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </UserSettingsProvider>
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
                )}
            </QueryClientProvider>
        </I18nProvider>
    );
}
