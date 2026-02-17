import { ChannelCodeLabel } from '@/vdb/components/shared/channel-code-label.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/vdb/components/ui/tabs.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/vdb/components/ui/tooltip.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useGroupedPermissions } from '@/vdb/hooks/use-grouped-permissions.js';
import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';

const rolesByIdDocument = graphql(`
    query RolesById($options: RoleListOptions) {
        roles(options: $options) {
            items {
                id
                code
                permissions
                channels {
                    id
                    code
                }
            }
        }
    }
`);

const channelsByIdDocument = graphql(`
    query ChannelRolePermChannels($options: ChannelListOptions) {
        channels(options: $options) {
            items {
                id
                code
            }
        }
    }
`);

interface ChannelRoleValue {
    channelId: string;
    roleId: string;
}

type RolePermissionsDisplayProps =
    | { value: string[]; channelRoles?: never }
    | { value?: never; channelRoles: ChannelRoleValue[] };

export function RolePermissionsDisplay(props: Readonly<RolePermissionsDisplayProps>) {
    if (props.channelRoles) {
        return <ChannelRolePermissionsDisplay channelRoles={props.channelRoles} />;
    }
    return <DefaultRolePermissionsDisplay value={props.value ?? []} />;
}

function DefaultRolePermissionsDisplay({ value = [] }: Readonly<{ value: string[] }>) {
    const groupedPermissions = useGroupedPermissions();

    const { data } = useQuery({
        queryKey: ['rolesById', value],
        queryFn: () =>
            api.query(rolesByIdDocument, {
                options: {
                    filter: {
                        id: { in: value },
                    },
                },
            }),
    });

    const roles = data?.roles.items ?? [];

    const allChannels = roles
        .flatMap(role => role.channels)
        .filter((channel, index, self) => index === self.findIndex(t => t.code === channel.code));

    const isPermissionEnabled = (permissionName: string, channelCode: string) => {
        // Check if any role has this permission for this channel
        return roles.some(role => {
            const hasPermission = role.permissions.includes(permissionName as any);
            const isChannelSpecificRole = role.channels.length > 0;

            if (!hasPermission) return false;

            if (!isChannelSpecificRole) {
                // If role is not channel-specific, permission applies to all channels
                return true;
            }

            // Check if the role applies to this specific channel
            return role.channels.some(channel => channel.code === channelCode);
        });
    };

    if (!allChannels.length) return null;

    return (
        <PermissionsTable
            allChannels={allChannels}
            groupedPermissions={groupedPermissions}
            isPermissionEnabled={isPermissionEnabled}
        />
    );
}

function ChannelRolePermissionsDisplay({ channelRoles }: Readonly<{ channelRoles: ChannelRoleValue[] }>) {
    const groupedPermissions = useGroupedPermissions();

    const roleIds = [...new Set(channelRoles.map(cr => cr.roleId).filter(Boolean))];
    const channelIds = [...new Set(channelRoles.map(cr => cr.channelId).filter(Boolean))];

    const { data: rolesData } = useQuery({
        queryKey: ['rolesById', roleIds],
        queryFn: () =>
            api.query(rolesByIdDocument, {
                options: {
                    filter: {
                        id: { in: roleIds },
                    },
                },
            }),
        enabled: roleIds.length > 0,
    });

    const { data: channelsData } = useQuery({
        queryKey: ['channelRolePermChannels', channelIds],
        queryFn: () =>
            api.query(channelsByIdDocument, {
                options: {
                    filter: {
                        id: { in: channelIds },
                    },
                },
            }),
        enabled: channelIds.length > 0,
    });

    const roles = rolesData?.roles.items ?? [];
    const channels = channelsData?.channels.items ?? [];

    const isPermissionEnabled = (permissionName: string, channelCode: string) => {
        const channel = channels.find(c => c.code === channelCode);
        if (!channel) return false;

        // Find all role assignments for this channel
        const roleIdsForChannel = channelRoles
            .filter(cr => cr.channelId === channel.id)
            .map(cr => cr.roleId);

        // Check if any of those roles have this permission
        return roles.some(
            role => roleIdsForChannel.includes(role.id) && role.permissions.includes(permissionName as any),
        );
    };

    if (!channels.length) return null;

    const channelRoleLabels = new Map<string, string>();
    for (const cr of channelRoles) {
        const role = roles.find(r => r.id === cr.roleId);
        if (role) {
            channelRoleLabels.set(cr.channelId, role.code);
        }
    }

    return (
        <PermissionsTable
            allChannels={channels}
            groupedPermissions={groupedPermissions}
            isPermissionEnabled={isPermissionEnabled}
            channelRoleLabels={channelRoleLabels}
        />
    );
}

interface PermissionsTableProps {
    allChannels: Array<{ id: string; code: string }>;
    groupedPermissions: ReturnType<typeof useGroupedPermissions>;
    isPermissionEnabled: (permissionName: string, channelCode: string) => boolean;
    channelRoleLabels?: Map<string, string>;
}

function PermissionsTable({ allChannels, groupedPermissions, isPermissionEnabled, channelRoleLabels }: PermissionsTableProps) {
    const { i18n } = useLingui();

    return (
        <Tabs defaultValue={allChannels[0].code} className="w-full mt-4">
            <TabsList>
                {allChannels.map(channel => {
                    const roleLabel = channelRoleLabels?.get(channel.id);
                    return (
                        <TabsTrigger key={channel.code} value={channel.code} type="button" className="cursor-pointer">
                            <ChannelCodeLabel code={channel.code} />
                            {roleLabel && <span className="ml-1 text-muted-foreground">({roleLabel})</span>}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            {allChannels.map(channel => (
                <TabsContent key={channel.code} value={channel.code} className="mt-0">
                    <div className="rounded-md border">
                        <table className="w-full">
                            <tbody>
                                {groupedPermissions.map((group, idx) => (
                                    <tr
                                        key={group.label}
                                        className={
                                            idx !== groupedPermissions.length - 1 ? 'border-b' : undefined
                                        }
                                    >
                                        <td className="p-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {group.permissions.map(permission => (
                                                    <div
                                                        key={permission.name}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            checked={isPermissionEnabled(
                                                                permission.name,
                                                                channel.code,
                                                            )}
                                                            disabled={true}
                                                        />
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <label className="text-sm cursor-default">
                                                                        {i18n.t(permission.name)}
                                                                    </label>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{i18n.t(permission.description)}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
