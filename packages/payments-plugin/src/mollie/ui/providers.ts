import { addActionBarDropdownMenuItem } from '@vendure/admin-ui/core';

export default [
    addActionBarDropdownMenuItem({
        id: 'print-invoice',
        locationId: 'order-detail',
        label: 'Get Payment Link',
        icon: 'euro',
        buttonState: context => {
            return context.entity$.pipe(
                map((order) => {
                    return (order?.state === 'ArrangingPayment' ?? order?.state === 'AddingItems')
                        ? { disabled: false, visible: true }
                        : { disabled: true, visible: true };
                }),
            );
        },
    }),
];