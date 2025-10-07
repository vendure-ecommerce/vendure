import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { CustomerGroupChip } from '../shared/customer-group-chip.js';
import { CustomerGroupSelector } from '../shared/customer-group-selector.js';

import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';

const customerGroupDocument = graphql(`
    query GetCustomerGroup($id: ID!) {
        customerGroup(id: $id) {
            id
            name
        }
    }
`);

export interface CustomerGroup {
    id: string;
    name: string;
}

export function CustomerGroupInput({
    value,
    onChange,
    disabled,
    fieldDef,
}: Readonly<DashboardFormComponentProps>) {
    const { data } = useQuery({
        queryKey: ['customerGroups', value],
        queryFn: () =>
            api.query(customerGroupDocument, {
                id: value,
            }),
        enabled: !!value,
    });

    const onValueSelectHandler = (value: CustomerGroup) => {
        onChange(value.id);
    };

    const onValueRemoveHandler = () => {
        onChange(null);
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {data?.customerGroup ? (
                    <CustomerGroupChip
                        key={data.customerGroup.id}
                        group={data.customerGroup}
                        onRemove={onValueRemoveHandler}
                    />
                ) : null}
            </div>

            <CustomerGroupSelector onSelect={onValueSelectHandler} readOnly={disabled} />
        </div>
    );
}
