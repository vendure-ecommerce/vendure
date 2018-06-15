import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
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
