import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';

// Using TS "import" results in the following error when building with the Angular CLI:
// "Error: <path>\node_modules\@vendure\admin-ui\library\app\app.module.d.ts is missing from the
// TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property."
// tslint:disable:no-var-requires
declare const require: any;
const { AppComponent, CoreModule } = require('@vendure/admin-ui');

@NgModule({
    declarations: [AppComponent],
    imports: [RouterModule.forRoot(routes, { useHash: false }), CoreModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
