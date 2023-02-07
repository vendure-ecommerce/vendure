import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent, AppComponentModule } from '@uplab/admin-ui/core';

import { routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AppComponentModule,
        RouterModule.forRoot(routes, { useHash: false, relativeLinkResolution: 'legacy' }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
