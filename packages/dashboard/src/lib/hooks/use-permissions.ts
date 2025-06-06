import { useAuth } from '@/hooks/use-auth.js';
import { useChannel } from '@/hooks/use-channel.js';
import { Permission } from '@vendure/common/lib/generated-types';

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
    const { selectedChannelId } = useChannel();

    function hasPermissions(permissions: string[]) {
        if (permissions.length === 0) {
            return true;
        }
        // Use the selected channel instead of settings.activeChannelId
        const activeChannel = (channels ?? []).find(channel => channel.id === selectedChannelId);
        if (!activeChannel) {
            return false;
        }
        return permissions.some(permission => activeChannel.permissions.includes(permission as Permission));
    }

    return { hasPermissions };
}
