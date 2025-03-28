import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { CustomerGroupChip } from '../shared/customer-group-chip.js';
import { CustomerGroupSelector } from '../shared/customer-group-selector.js';

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

export interface CustomerGroupInputProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

export function CustomerGroupInput(props: CustomerGroupInputProps) {
    const ids = decodeIds(props.value);
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
        props.onChange(JSON.stringify(Array.from(newIds)));
    };

    const onValueRemoveHandler = (id: string) => {
        const newIds = new Set(ids.filter(existingId => existingId !== id));
        props.onChange(JSON.stringify(Array.from(newIds)));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {groups?.customerGroups.items.map(group => (
                    <CustomerGroupChip key={group.id} group={group} onRemove={onValueRemoveHandler} />
                ))}
            </div>

            <CustomerGroupSelector onSelect={onValueSelectHandler} readOnly={props.readOnly} />
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
