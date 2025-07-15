import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { MultiSelect } from './multi-select.js';

const rolesDocument = graphql(`
    query Roles($options: RoleListOptions) {
        roles(options: $options) {
            items {
                id
                code
                description
            }
        }
    }
`);

export interface RoleSelectorProps<T extends boolean> {
    value: T extends true ? string[] : string;
    onChange: (value: T extends true ? string[] : string) => void;
    multiple?: T;
}

export function RoleSelector<T extends boolean>(props: RoleSelectorProps<T>) {
    const { value, onChange, multiple } = props;
    const { i18n } = useLingui();

    const { data } = useQuery({
        queryKey: ['roles'],
        queryFn: () =>
            api.query(rolesDocument, {
                options: {
                    take: 100,
                },
            }),
        select: data => data.roles.items,
    });

    const items = (data ?? []).map(role => ({
        value: role.id,
        label: role.code,
        display: role.description ? role.description : role.code,
    }));

    return (
        <MultiSelect
            value={value}
            onChange={onChange}
            multiple={multiple}
            items={items}
            placeholder={i18n.t('Select a role')}
            searchPlaceholder={i18n.t('Search roles...')}
        />
    );
}
