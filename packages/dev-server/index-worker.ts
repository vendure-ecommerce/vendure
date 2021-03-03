import { bootstrapWorker } from '@vendure/core';

import { devConfig } from './dev-config';

// https://github.com/vendure-ecommerce/vendure/issues/152
// fix race condition when modifying DB
devConfig.dbConnectionOptions = { ...devConfig.dbConnectionOptions, synchronize: false };

bootstrapWorker(devConfig)
    .then(worker => worker.startJobQueue())
    .catch(err => {
        // tslint:disable-next-line
        console.log(err);
        process.exit(1);
    });
