import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

export const loginRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        pathMatch: 'full',
    },
];
