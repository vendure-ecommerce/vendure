import { api, SELECTED_CHANNEL_TOKEN_KEY } from '@/vdb/graphql/api.js';
import { graphql, ResultOf } from '@/vdb/graphql/graphql.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
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
const activeChannelDocument = graphql(
    `
        query ChannelInformation {
            activeChannel {
                ...ChannelInfo
                defaultTaxZone {
                    id
                }
            }
        }
    `,
    [channelFragment],
);

const channelsDocument = graphql(
    `
        query ChannelInformation {
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
type ActiveChannel = ResultOf<typeof activeChannelDocument>['activeChannel'];
type Channel = ResultOf<typeof channelFragment>;

/**
 * @description
 * Provides information about the active channel, and the means to set a new
 * active channel.
 *
 * @docsCategory hooks
 * @docsPage useChannel
 * @since 3.3.0
 */
export interface ChannelContext {
    /**
     * @description
     * Whether the channels are loading.
     */
    isLoading: boolean;
    /**
     * @description
     * An array of all available channels.
     */
    channels: Channel[];
    /**
     * @description
     * The active channel.
     */
    activeChannel: ActiveChannel | undefined;
    /**
     * @description
     * The function to set the active channel.
     */
    setActiveChannel: (channelId: string) => void;
    /**
     * @description
     * The function to refresh the channels.
     */
    refreshChannels: () => void;
}

/**
 * Sets the channel token in localStorage, which is then used by the `api`
 * object to ensure we add the correct token header to all API calls.
 */
function setChannelTokenInLocalStorage(channelToken: string) {
    try {
        localStorage.setItem(SELECTED_CHANNEL_TOKEN_KEY, channelToken);
    } catch (e) {
        console.error('Failed to store selected channel in localStorage', e);
    }
}

// Create the context
export const ChannelContext = React.createContext<ChannelContext | undefined>(undefined);

export function ChannelProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = useQueryClient();
    const {
        setActiveChannelId,
        settings: { activeChannelId },
    } = useUserSettings();
    const { channels: userChannels, isAuthenticated, refreshCurrentUser } = useAuth();
    const [selectedChannelId, setSelectedChannelId] = React.useState<string | undefined>(() => {
        return activeChannelId;
    });

    // Fetch active channel
    const { data: activeChannelData, isLoading: isActiveChannelLoading } = useQuery({
        queryKey: ['activeChannel', isAuthenticated],
        queryFn: () => api.query(activeChannelDocument),
        retry: false,
        enabled: isAuthenticated,
    });

    // Fetch all available channels
    const { data: channelsData } = useQuery({
        queryKey: ['channels', isAuthenticated],
        queryFn: () => api.query(channelsDocument),
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
            const channel = channels.find(c => c.id === channelId);
            if (channel) {
                setChannelTokenInLocalStorage(channel.token);
                setSelectedChannelId(channelId);
                setActiveChannelId(channelId);
                queryClient.invalidateQueries();
            }
        },
        [queryClient, channels],
    );

    // If no selected channel is set but we have an active channel, use that
    // Also validate that the selected channel is accessible to the user
    React.useEffect(() => {
        const validChannelIds = channels.map(c => c.id);

        // If selected channel is not valid for this user, reset it
        if (selectedChannelId && validChannelIds.length && !validChannelIds.includes(selectedChannelId)) {
            setSelectedChannelId(undefined);
        }

        // If no selected channel is set, use the first available channel
        if (!selectedChannelId && channels.length > 0) {
            const defaultChannel = channels[0];
            setSelectedChannelId(defaultChannel.id);
            setChannelTokenInLocalStorage(defaultChannel.token);
        }
    }, [selectedChannelId, channels]);

    const isLoading = isActiveChannelLoading;

    // Find the selected channel from the list of channels
    const selectedChannel = activeChannelData?.activeChannel;

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
