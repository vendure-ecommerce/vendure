import { api } from '@/vdb/graphql/api.js';
import { graphql, ResultOf } from '@/vdb/graphql/graphql.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

// Define the channel fragment for reuse
const channelFragment = graphql(`
    fragment ChannelInfo on Channel {
        id
        code
        token
        defaultLanguageCode
        defaultCurrencyCode
        pricesIncludeTax
        availableLanguageCodes
    }
`);

// Query to get all available channels and the active channel
const ChannelsQuery = graphql(
    `
        query ChannelInformation {
            activeChannel {
                ...ChannelInfo
                defaultTaxZone {
                    id
                }
            }
            channels {
                items {
                    ...ChannelInfo
                }
                totalItems
            }
        }
    `,
    [channelFragment],
);

// Define the type for a channel
type ActiveChannel = ResultOf<typeof ChannelsQuery>['activeChannel'];
type Channel = ResultOf<typeof channelFragment>;

/**
 * @description
 * **Status: Developer Preview**
 *
 * @docsCategory hooks
 * @docsPage useChannel
 * @since 3.3.0
 */
export interface ChannelContext {
    isLoading: boolean;
    channels: Channel[];
    activeChannel: ActiveChannel | undefined;
    setActiveChannel: (channelId: string) => void;
    refreshChannels: () => void;
}

// Create the context
export const ChannelContext = React.createContext<ChannelContext | undefined>(undefined);

// Local storage key for the selected channel
const SELECTED_CHANNEL_KEY = 'vendure-selected-channel';
const SELECTED_CHANNEL_TOKEN_KEY = 'vendure-selected-channel-token';

export function ChannelProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = useQueryClient();
    const { channels: userChannels, isAuthenticated, refreshCurrentUser } = useAuth();
    const [selectedChannelId, setSelectedChannelId] = React.useState<string | undefined>(() => {
        // Initialize from localStorage if available
        try {
            const storedChannelId = localStorage.getItem(SELECTED_CHANNEL_KEY);
            return storedChannelId || undefined;
        } catch (e) {
            console.error('Failed to load selected channel from localStorage', e);
            return undefined;
        }
    });

    // Fetch all available channels
    const { data: channelsData, isLoading: isChannelsLoading } = useQuery({
        queryKey: ['channels', isAuthenticated],
        queryFn: () => api.query(ChannelsQuery),
        retry: false,
        enabled: isAuthenticated,
    });

    // Filter channels based on user permissions
    const channels = React.useMemo(() => {
        // If user has specific channels assigned, use those
        if (userChannels && userChannels.length > 0) {
            // Map user channels to match the Channel type structure
            return userChannels.map(ch => {
                const fullChannelData = channelsData?.channels.items.find(c => c.id === ch.id);
                return {
                    id: ch.id,
                    code: fullChannelData?.code ?? ch.code,
                    token: fullChannelData?.token ?? ch.token,
                    defaultLanguageCode: fullChannelData?.defaultLanguageCode || 'en',
                    defaultCurrencyCode: fullChannelData?.defaultCurrencyCode || 'USD',
                    pricesIncludeTax: fullChannelData?.pricesIncludeTax || false,
                    availableLanguageCodes: fullChannelData?.availableLanguageCodes || ['en'],
                };
            });
        }
        // Otherwise use all channels
        return channelsData?.channels.items || [];
    }, [userChannels, channelsData?.channels.items]);

    // Set the selected channel and update localStorage
    const setSelectedChannel = React.useCallback(
        (channelId: string) => {
            try {
                // Find the channel to get its token
                const channel = channels.find(c => c.id === channelId);
                if (channel) {
                    // Store channel ID and token in localStorage
                    localStorage.setItem(SELECTED_CHANNEL_KEY, channelId);
                    localStorage.setItem(SELECTED_CHANNEL_TOKEN_KEY, channel.token);
                    setSelectedChannelId(channelId);

                    queryClient.invalidateQueries();
                }
            } catch (e) {
                console.error('Failed to set selected channel', e);
            }
        },
        [queryClient, channels],
    );

    // If no selected channel is set but we have an active channel, use that
    // Also validate that the selected channel is accessible to the user
    React.useEffect(() => {
        const validChannelIds = channels.map(c => c.id);

        // If selected channel is not valid for this user, reset it
        if (selectedChannelId && !validChannelIds.includes(selectedChannelId)) {
            setSelectedChannelId(undefined);
            try {
                localStorage.removeItem(SELECTED_CHANNEL_KEY);
                localStorage.removeItem(SELECTED_CHANNEL_TOKEN_KEY);
            } catch (e) {
                console.error('Failed to remove selected channel from localStorage', e);
            }
        }

        // If no selected channel is set, use the first available channel
        if (!selectedChannelId && channels.length > 0) {
            const defaultChannel = channels[0];
            setSelectedChannelId(defaultChannel.id);
            try {
                localStorage.setItem(SELECTED_CHANNEL_KEY, defaultChannel.id);
                localStorage.setItem(SELECTED_CHANNEL_TOKEN_KEY, defaultChannel.token);
            } catch (e) {
                console.error('Failed to store selected channel in localStorage', e);
            }
        }
    }, [selectedChannelId, channels]);

    const isLoading = isChannelsLoading;

    // Find the selected channel from the list of channels
    const selectedChannel = channelsData?.activeChannel;

    const refreshChannels = () => {
        refreshCurrentUser();
        queryClient.invalidateQueries({
            queryKey: ['channels', isAuthenticated],
        });
    };

    const contextValue: ChannelContext = {
        channels,
        activeChannel: selectedChannel,
        isLoading,
        setActiveChannel: setSelectedChannel,
        refreshChannels,
    };

    return <ChannelContext.Provider value={contextValue}>{children}</ChannelContext.Provider>;
}
