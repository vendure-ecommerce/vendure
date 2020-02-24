import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

import { AppShellComponent } from './core/components/app-shell/app-shell.component';
import { AuthGuard } from './core/providers/guard/auth.guard';

export const routes: Route[] = [
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
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
                loadChildren: './dashboard/dashboard.module#DashboardModule',
            },
            {
                path: 'catalog',
                loadChildren: './catalog/catalog.module#CatalogModule',
            },
            {
                path: 'customer',
                loadChildren: './customer/customer.module#CustomerModule',
            },
            {
                path: 'orders',
                loadChildren: './order/order.module#OrderModule',
            },
            {
                path: 'marketing',
                loadChildren: './marketing/marketing.module#MarketingModule',
            },
            {
                path: 'settings',
                loadChildren: './settings/settings.module#SettingsModule',
            },
            {
                path: 'extensions',
                loadChildren: `./extensions/lazy-extensions.module#LazyExtensionsModule`,
            },
        ],
    },
];
