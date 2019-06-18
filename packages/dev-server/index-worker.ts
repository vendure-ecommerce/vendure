import { bootstrapWorker } from '@vendure/core';

import { devConfig } from './dev-config';

bootstrapWorker(devConfig).catch(err => {
    // tslint:disable-next-line
    console.log(err);
});
