import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config).catch(err => {
    // tslint:disable-next-line:no-console
    console.log(err);
});
