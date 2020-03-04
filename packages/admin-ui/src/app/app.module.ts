import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent, AppComponentModule } from '@vendure/admin-ui/core';

import { routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [AppComponentModule, RouterModule.forRoot(routes, { useHash: false })],
    bootstrap: [AppComponent],
})
export class AppModule {}
