import { registerRouteComponent } from '@vendure/admin-ui/core';
import { registerReactRouteComponent } from '@vendure/admin-ui/react';

import { AngularUiComponent } from './angular-components/angular-ui/angular-ui.component';
import { ReactUi } from './react-components/ReactUi';

export default [
    registerReactRouteComponent({
        path: 'react-ui',
        component: ReactUi,
        title: 'React UI',
    }),
    registerRouteComponent({
        path: 'angular-ui',
        component: AngularUiComponent,
        title: 'Angular UI',
    }),
];
