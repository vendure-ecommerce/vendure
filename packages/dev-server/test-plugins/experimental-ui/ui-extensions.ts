import { addNavMenuSection } from '@vendure/admin-ui/core';
import { registerReactFormInputComponent } from '@vendure/admin-ui/react';

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
];
