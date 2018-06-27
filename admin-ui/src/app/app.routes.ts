import { Route } from '@angular/router';
import { AppShellComponent } from './core/components/app-shell/app-shell.component';
import { AuthGuard } from './core/providers/guard/auth.guard';

export const routes: Route[] = [
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AppShellComponent,
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
        ],
    },
];
