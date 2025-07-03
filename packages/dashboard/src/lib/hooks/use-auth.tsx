import { AuthContext } from '@/vdb/providers/auth.js';
import * as React from 'react';

/**
 * @description
 * **Status: Developer Preview**
 *
 * Provides access to the {@link ChannelContext} which contains information
 * about the active channel.
 *
 *
 * @docsCategory hooks
 * @docsPage useAuth
 * @docsWeight 0
 * @since 3.3.0
 */
export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
