import { addNavMenuItem, addNavMenuSection } from '@vendure/admin-ui/core';
import { registerReactFormInputComponent } from '@vendure/admin-ui/react';

import { ReactNumberInput } from './ReactNumberInput';

export default [
    addNavMenuSection(
        {
            id: 'greeter',
            label: 'My Extensions',
            items: [
                {
                    id: 'greeter',
                    label: 'Greeter',
                    routerLink: ['/extensions/greet'],
                    icon: 'cursor-hand-open',
                },
            ],
        },
        // Add this section before the "settings" section
        'settings',
    ),
    addNavMenuItem(
        {
            id: 'reviews',
            label: 'Product Reviews',
            routerLink: ['/extensions/reviews'],
            icon: 'star',
        },
        'marketing',
    ),
    registerReactFormInputComponent('react-number-input', ReactNumberInput),
];
