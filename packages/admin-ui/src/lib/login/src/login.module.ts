import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { LoginComponent } from './components/login/login.component';
import { loginRoutes } from './login.routes';
import { LoginGuard } from './providers/login.guard';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(loginRoutes)],
    exports: [],
    declarations: [LoginComponent],
    providers: [LoginGuard],
})
export class LoginModule {}
