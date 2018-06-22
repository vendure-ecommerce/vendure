import { devConfig } from './dev-config';
import { bootstrap } from './src';

/**
 * This bootstraps the dev server, used for testing Vendure during development.
 */
bootstrap(devConfig).catch(err => {
    // tslint:disable-next-line
    console.log(err);
});
