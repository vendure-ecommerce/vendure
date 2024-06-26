import { PageLocationId, addNavMenuSection, registerPageTab } from '@vendure/admin-ui/core';
import { AngularUiComponent } from './angular-components/angular-ui/angular-ui.component';

export default [
    addNavMenuSection({
        id: 'ui-extensions-library',
        label: 'UI Extensions Library',
        items: [
            {
                id: 'react-ui',
                label: 'React UI',
                routerLink: ['/extensions/ui-library/react-ui'],
            },
            {
                id: 'angular-ui',
                label: 'Angular UI',
                routerLink: ['/extensions/ui-library/angular-ui'],
            },
        ],
    }),
    //Testing page tabs on custom angular components
    registerPageTab({
        location: 'angular-ui' as PageLocationId,
        tab: 'Example Tab 1',
        route: '/extensions/ui-library/angular-ui',
        tabIcon: 'star',
        component: AngularUiComponent,
    }),
    registerPageTab({
        location: 'angular-ui' as PageLocationId,
        tab: 'Example Tab 2',
        route: '/extensions/ui-library/angular-ui2',
        tabIcon: 'star',
        component: AngularUiComponent,
    }),
    registerPageTab({
        location: 'react-ui' as PageLocationId,
        tab: 'Example Tab 1',
        route: '/extensions/ui-library/angular-ui',
        tabIcon: 'star',
        component: AngularUiComponent,
    }),
    registerPageTab({
        location: 'react-ui' as PageLocationId,
        tab: 'Example Tab 2',
        route: '/extensions/ui-library/angular-ui2',
        tabIcon: 'star',
        component: AngularUiComponent,
    }),
];
