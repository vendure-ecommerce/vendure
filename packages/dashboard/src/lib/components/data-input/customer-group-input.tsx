import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { CustomerGroupChip } from '../shared/customer-group-chip.js';
import { CustomerGroupSelector } from '../shared/customer-group-selector.js';

import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';

const customerGroupsDocument = graphql(`
    query GetCustomerGroups($options: CustomerGroupListOptions) {
        customerGroups(options: $options) {
            items {
                id
                name
            }
        }
    }
`);

export interface CustomerGroup {
    id: string;
    name: string;
}

export function CustomerGroupInput({ value, onChange, disabled }: Readonly<DashboardFormComponentProps>) {
    const ids = decodeIds(value);
    const { data: groups } = useQuery({
        queryKey: ['customerGroups', ids],
        queryFn: () =>
            api.query(customerGroupsDocument, {
                options: {
                    filter: {
                        id: { in: ids },
                    },
                },
            }),
    });

    const onValueSelectHandler = (value: CustomerGroup) => {
        const newIds = new Set([...ids, value.id]);
        onChange(JSON.stringify(Array.from(newIds)));
    };

    const onValueRemoveHandler = (id: string) => {
        const newIds = new Set(ids.filter(existingId => existingId !== id));
        onChange(JSON.stringify(Array.from(newIds)));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {groups?.customerGroups.items.map(group => (
                    <CustomerGroupChip key={group.id} group={group} onRemove={onValueRemoveHandler} />
                ))}
            </div>

            <CustomerGroupSelector onSelect={onValueSelectHandler} readOnly={disabled} />
        </div>
    );
}

function decodeIds(idsString: string): string[] {
    try {
        return JSON.parse(idsString);
    } catch (error) {
        return [];
    }
}
