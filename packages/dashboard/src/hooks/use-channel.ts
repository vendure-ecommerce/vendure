import { ChannelContext } from '@/providers/channel-provider.js';
import * as React from 'react';

// Hook to use the channel context

export function useChannel() {
    const context = React.useContext(ChannelContext);
    if (context === undefined) {
        throw new Error('useChannel must be used within a ChannelProvider');
    }
    return context;
}
