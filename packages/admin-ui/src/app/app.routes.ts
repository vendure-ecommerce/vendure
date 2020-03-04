import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

import { AppShellComponent } from './core/components/app-shell/app-shell.component';
import { AuthGuard } from './core/providers/guard/auth.guard';

export const routes: Route[] = [
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
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
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'catalog',
                loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
            },
            {
                path: 'customer',
                loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
            },
            {
                path: 'orders',
                loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
            },
            {
                path: 'marketing',
                loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingModule),
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
            },
        ],
    },
];
