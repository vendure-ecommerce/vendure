import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

// Using TS "import" results in the following error when building with the Angular CLI:
// "Error: <path>\node_modules\@vendure\admin-ui\library\app\app.module.d.ts is missing from the
// TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property."
// tslint:disable:no-var-requires
declare const require: any;
const { AppShellComponent, AuthGuard } = require('@vendure/admin-ui');

export const routes: Route[] = [
    {
        path: 'login',
        loadChildren: () => import('./routing/login-wrapper.module').then(m => m.LoginWrapperModule),
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AppShellComponent,
        data: {
            breadcrumb: _('breadcrumb.dashboard'),
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadChildren: () =>
                    import('./routing/dashboard-wrapper.module').then(m => m.DashboardWrapperModule),
            },
            {
                path: 'catalog',
                loadChildren: () =>
                    import('./routing/catalog-wrapper.module').then(m => m.CatalogWrapperModule),
            },
            {
                path: 'customer',
                loadChildren: () =>
                    import('./routing/customer-wrapper.module').then(m => m.CustomerWrapperModule),
            },
            {
                path: 'orders',
                loadChildren: () => import('./routing/order-wrapper.module').then(m => m.OrderWrapperModule),
            },
            {
                path: 'marketing',
                loadChildren: () =>
                    import('./routing/marketing-wrapper.module').then(m => m.MarketingWrapperModule),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./routing/settings-wrapper.module').then(m => m.SettingsWrapperModule),
            },
        ],
    },
];
