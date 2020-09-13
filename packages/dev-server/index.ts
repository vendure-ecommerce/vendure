import { bootstrap } from '@vendure/core';

import { devConfig } from './dev-config';

/**
 * This bootstraps the dev server, used for testing Vendure during development.
 */
bootstrap(devConfig).catch((err) => {
    // tslint:disable-next-line
    console.log(err);
    process.exit(1);
});
