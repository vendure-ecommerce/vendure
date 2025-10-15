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
import { transformDocumentNodeInSource } from './transform-document-node.js';

const queryClient = new QueryClient();

/**
 * Clean JSDoc tags from component descriptions
 * Removes @description, @example, @docsCategory, @docsPage tags while keeping content
 */
function cleanJSDocDescription(description: string): string {
    if (!description) return description;

    return (
        description
            // Remove @description tag but keep the text
            .replace(/@description\s*/gi, '')
            // Replace @example with Example: label
            .replace(/@example\s*/gi, 'Example:\n')
            // Remove @docsCategory and @docsPage lines entirely
            .replace(/@docsCategory\s+[\w-]+/gi, '')
            .replace(/@docsPage\s+[\w-]+/gi, '')
            // Clean up extra whitespace
            .replace(/\n\n\n+/g, '\n\n')
            .trim()
    );
}

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
        docs: {
            source: {
                transform: async (source: string, storyContext: any) => {
                    return transformDocumentNodeInSource(source, storyContext);
                },
            },
            // Transform component descriptions to remove JSDoc tags
            extractComponentDescription: (_component: any, { component }: any) => {
                // Try to get description from docgen first
                const docgenInfo = component?.__docgenInfo;

                // If docgen has a description, clean it
                if (docgenInfo?.description) {
                    const cleaned = cleanJSDocDescription(docgenInfo.description);
                    if (cleaned) {
                        return cleaned;
                    }
                }

                // If no description in docgen, try to extract from component's toString()
                // This is a fallback for when docgen doesn't extract @description properly
                const componentStr = component?.toString() || '';
                const jsdocMatch = componentStr.match(/\/\*\*([\s\S]*?)\*\//);

                if (jsdocMatch) {
                    const jsdoc = jsdocMatch[0];
                    // Extract text after @description tag
                    const descMatch = jsdoc.match(/@description\s*\n\s*\*\s*(.*?)(?=\n\s*\*\s*@|\n\s*\*\/)/s);
                    if (descMatch) {
                        return descMatch[1].trim();
                    }
                }

                return null;
            },
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
                            <ThemeProvider defaultTheme="light">
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
