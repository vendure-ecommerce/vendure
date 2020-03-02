import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { CoreModule } from './core/core.module';

@NgModule({
    declarations: [AppComponent],
    imports: [RouterModule.forRoot(routes, { useHash: false }), CoreModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
