import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { AppShellComponent, AuthGuard } from '@uplab/admin-ui/core';

export const routes: Route[] = [
    { path: 'login', loadChildren: () => import('@uplab/admin-ui/login').then(m => m.LoginModule) },
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
                loadChildren: () => import('@uplab/admin-ui/dashboard').then(m => m.DashboardModule),
            },
            {
                path: 'catalog',
                loadChildren: () => import('@uplab/admin-ui/catalog').then(m => m.CatalogModule),
            },
            {
                path: 'customer',
                loadChildren: () => import('@uplab/admin-ui/customer').then(m => m.CustomerModule),
            },
            {
                path: 'orders',
                loadChildren: () => import('@uplab/admin-ui/order').then(m => m.OrderModule),
            },
            {
                path: 'marketing',
                loadChildren: () => import('@uplab/admin-ui/marketing').then(m => m.MarketingModule),
            },
            {
                path: 'settings',
                loadChildren: () => import('@uplab/admin-ui/settings').then(m => m.SettingsModule),
            },
            {
                path: 'system',
                loadChildren: () => import('@uplab/admin-ui/system').then(m => m.SystemModule),
            },
        ],
    },
];
