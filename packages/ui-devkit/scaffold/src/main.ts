import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

// Using TS "import" results in the following error when building with the Angular CLI:
// "Error: <path>\node_modules\@vendure\admin-ui\library\app\app.module.d.ts is missing from the
// TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property."
// tslint:disable:no-var-requires
declare const require: any;
const { loadAppConfig } = require('@vendure/admin-ui');

if (false) {
    enableProdMode();
}

loadAppConfig()
    .then(() => platformBrowserDynamic().bootstrapModule(AppModule))
    .catch((err: any) => {
        // tslint:disable:no-console
        console.log(err);
    });
