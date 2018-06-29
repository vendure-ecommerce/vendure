import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './components/login/login.component';
import { loginRoutes } from './login.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(loginRoutes),
    ],
    exports: [],
    declarations: [LoginComponent],
    providers: [],
})
export class LoginModule {
}
