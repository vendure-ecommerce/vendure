import { addNavMenuSection, registerDataTableComponent } from '@vendure/admin-ui/core';
import {
    registerReactFormInputComponent,
    registerReactCustomDetailComponent,
    registerReactDataTableComponent,
} from '@vendure/admin-ui/react';

import { CustomTableComponent } from './components/custom-table.component';
import { CustomColumnComponent } from './components/CustomColumnComponent';
import { CustomDetailComponent } from './components/CustomDetailComponent';
import { ReactNumberInput } from './components/ReactNumberInput';

export default [
    addNavMenuSection(
        {
            id: 'greeter',
            label: 'My Extensions',
            items: [
                {
                    id: 'greeter',
                    label: 'Greeter',
                    routerLink: ['/extensions/example/greet'],
                    icon: 'cursor-hand-open',
                },
                {
                    id: 'products',
                    label: 'Products',
                    routerLink: ['/extensions/example/products'],
                    icon: 'checkbox-list',
                },
            ],
        },
        'settings',
    ),
    registerReactFormInputComponent('react-number-input', ReactNumberInput),
    registerReactCustomDetailComponent({
        component: CustomDetailComponent,
        locationId: 'product-detail',
        props: {
            foo: 'bar',
        },
    }),
    registerDataTableComponent({
        component: CustomTableComponent,
        tableId: 'product-list',
        columnId: 'slug',
    }),
    registerReactDataTableComponent({
        component: CustomColumnComponent,
        tableId: 'product-list',
        columnId: 'id',
        props: {
            foo: 'bar',
        },
    }),
];
