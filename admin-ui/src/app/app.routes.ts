import { Route } from '@angular/router';

import { AppShellComponent } from './core/components/app-shell/app-shell.component';
import { AuthGuard } from './core/providers/guard/auth.guard';
import { _ } from './core/providers/i18n/mark-for-extraction';

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
                path: 'admin',
                loadChildren: './administrator/administrator.module#AdministratorModule',
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
        ],
    },
];
