import { registerDataTableComponent } from '@vendure/admin-ui/core';
import { registerReactDataTableComponent } from '@vendure/admin-ui/react';

import { SlugWithLinkComponent } from './components/slug-with-link.component';
import { SlugWithLink } from './components/SlugWithLink';

export default [
    registerDataTableComponent({
        component: SlugWithLinkComponent,
        tableId: 'product-list',
        columnId: 'slug',
    }),
    registerReactDataTableComponent({
        component: SlugWithLink,
        tableId: 'collection-list',
        columnId: 'slug',
        props: {
            foo: 'bar',
        },
    }),
];
