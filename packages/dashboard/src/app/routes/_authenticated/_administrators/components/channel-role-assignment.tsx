import { ChannelCodeLabel } from '@/vdb/components/shared/channel-code-label.js';
import { Button } from '@/vdb/components/ui/button.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/vdb/components/ui/select.js';

const channelsDocument = graphql(`
    query ChannelRoleChannels($options: ChannelListOptions) {
        channels(options: $options) {
            items {
                id
                code
            }
        }
    }
`);

const rolesDocument = graphql(`
    query ChannelRoleRoles($options: RoleListOptions) {
        roles(options: $options) {
            items {
                id
                code
                description
            }
        }
    }
`);

export interface ChannelRoleValue {
    channelId: string;
    roleId: string;
}

interface ChannelRoleAssignmentProps {
    value: ChannelRoleValue[];
    onChange: (value: ChannelRoleValue[]) => void;
}

export function ChannelRoleAssignment({ value, onChange }: Readonly<ChannelRoleAssignmentProps>) {
    const { t } = useLingui();

    const { data: channelsData } = useQuery({
        queryKey: ['channels'],
        queryFn: () => api.query(channelsDocument, {}),
        staleTime: 1000 * 60 * 5,
    });

    const { data: rolesData } = useQuery({
        queryKey: ['roles'],
        queryFn: () =>
            api.query(rolesDocument, {
                options: { take: 100 },
            }),
        staleTime: 1000 * 60 * 5,
    });

    const channels = channelsData?.channels.items ?? [];
    const roles = rolesData?.roles.items ?? [];

    const addRow = () => {
        onChange([...value, { channelId: '', roleId: '' }]);
    };

    const removeRow = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: 'channelId' | 'roleId', fieldValue: string) => {
        const updated = [...value];
        updated[index] = { ...updated[index], [field]: fieldValue };
        onChange(updated);
    };

    return (
        <div className="space-y-3">
            {value.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Select
                        value={row.channelId}
                        onValueChange={val => updateRow(index, 'channelId', val)}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder={t`Select channel`}>
                                {row.channelId
                                    ? (() => {
                                          const ch = channels.find(c => c.id === row.channelId);
                                          return ch ? <ChannelCodeLabel code={ch.code} /> : row.channelId;
                                      })()
                                    : null}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {channels.map(channel => (
                                <SelectItem key={channel.id} value={channel.id}>
                                    <ChannelCodeLabel code={channel.code} />
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={row.roleId}
                        onValueChange={val => updateRow(index, 'roleId', val)}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder={t`Select role`}>
                                {row.roleId
                                    ? (() => {
                                          const r = roles.find(rl => rl.id === row.roleId);
                                          return r ? (r.description || r.code) : row.roleId;
                                      })()
                                    : null}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                    {role.description || role.code}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
                <Plus className="h-4 w-4 mr-1" />
                <Trans>Add channel-role</Trans>
            </Button>
        </div>
    );
}
