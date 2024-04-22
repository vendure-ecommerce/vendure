import { CustomFieldConfig, Order, CustomOrderFields } from '@bb-vendure/core';

export interface OrderWithMollieReference extends Order {
    customFields: CustomOrderFields & {
        mollieOrderId?: string;
    };
}

export const orderCustomFields: CustomFieldConfig[] = [
    {
        name: 'mollieOrderId',
        type: 'string',
        internal: true,
        nullable: true,
    },
];
