import { api } from '@/graphql/api.js';
import { ResultOf, graphql } from '@/graphql/graphql.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth.js';
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
    activeChannel: ActiveChannel | undefined;
    channels: Channel[];
    selectedChannelId: string | undefined;
    selectedChannel: Channel | undefined;
    isLoading: boolean;
    setSelectedChannel: (channelId: string) => void;
}

// Create the context
export const ChannelContext = React.createContext<ChannelContext | undefined>(undefined);

// Local storage key for the selected channel
const SELECTED_CHANNEL_KEY = 'vendure-selected-channel';

export function ChannelProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
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
    const { data: channelsData, isLoading: isChannelsLoading, refetch: refetchChannels } = useQuery({
        queryKey: ['channels'],
        queryFn: () => api.query(ChannelsQuery),
        retry: false,
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            // Refetch channels when authenticated
            refetchChannels();
        }
    }, [isAuthenticated, refetchChannels])

    // Set the selected channel and update localStorage
    const setSelectedChannel = React.useCallback((channelId: string) => {
        try {
            // Store in localStorage
            localStorage.setItem(SELECTED_CHANNEL_KEY, channelId);
            setSelectedChannelId(channelId);
            queryClient.invalidateQueries();
        } catch (e) {
            console.error('Failed to set selected channel', e);
        }
    }, []);

    // If no selected channel is set but we have an active channel, use that
    React.useEffect(() => {
        if (!selectedChannelId && channelsData?.activeChannel?.id) {
            setSelectedChannelId(channelsData.activeChannel.id);
            try {
                localStorage.setItem(SELECTED_CHANNEL_KEY, channelsData.activeChannel.id);
            } catch (e) {
                console.error('Failed to store selected channel in localStorage', e);
            }
        }
    }, [selectedChannelId, channelsData]);

    const channels = channelsData?.channels.items || [];
    const activeChannel = channelsData?.activeChannel;
    const isLoading = isChannelsLoading;

    // Find the selected channel from the list of channels
    const selectedChannel = React.useMemo(() => {
        return channels.find(channel => channel.id === selectedChannelId);
    }, [channels, selectedChannelId]);

    const contextValue: ChannelContext = {
        activeChannel,
        channels,
        selectedChannelId,
        selectedChannel,
        isLoading,
        setSelectedChannel,
    };

    return <ChannelContext.Provider value={contextValue}>{children}</ChannelContext.Provider>;
}
