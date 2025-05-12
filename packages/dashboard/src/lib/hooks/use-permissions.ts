import { useAuth } from '@/hooks/use-auth.js';
import { Permission } from '@vendure/common/lib/generated-types';

import { useUserSettings } from './use-user-settings.js';

/**
 * @description
 * **Status: Developer Preview**
 *
 * Returns a `hasPermissions` function that can be used to determine whether the active user
 * has the given permissions on the active channel.
 *
 *
 * @docsCategory hooks
 * @docsPage usePermissions
 * @docsWeight 0
 * @since 3.3.0
 */
export function usePermissions() {
    const { channels } = useAuth();
    const { settings } = useUserSettings();

    function hasPermissions(permissions: string[]) {
        if (permissions.length === 0) {
            return true;
        }
        const activeChannel = (channels ?? []).find(channel => channel.id === settings.activeChannelId);
        if (!activeChannel) {
            return false;
        }
        return permissions.some(permission => activeChannel.permissions.includes(permission as Permission));
    }

    return { hasPermissions };
}
