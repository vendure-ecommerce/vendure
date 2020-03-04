import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppComponentModule } from './app.component.module';
import { routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [AppComponentModule, RouterModule.forRoot(routes, { useHash: false })],
    bootstrap: [AppComponent],
})
export class AppModule {}
