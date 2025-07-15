import { usePermissions } from '@/vdb/hooks/use-permissions.js';
import { Permission } from '@vendure/common/lib/generated-types';

export interface PermissionGuardProps {
    requires: Permission | string | string[] | Permission[];
    children: React.ReactNode;
}

/**
 * @description
 * This component is used to protect a route from unauthorized access.
 * It will render the children if the user has the required permissions.
 */
export function PermissionGuard({ requires, children }: Readonly<PermissionGuardProps>) {
    const { hasPermissions } = usePermissions();
    const permissions = Array.isArray(requires) ? requires : [requires];
    if (!hasPermissions(permissions)) {
        return null;
    }
    return children;
}
