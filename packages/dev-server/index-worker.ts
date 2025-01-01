import { bootstrapWorker, mergeConfig } from '@vendure/core';

import { devConfig } from './dev-config';

bootstrapWorker(
    mergeConfig(devConfig, {
        jobQueueOptions: {
            // excludedQueues: ['update-search-index'],
        },
    }),
)
    .then(worker => worker.startJobQueue())
    // .then(worker => worker.startHealthCheckServer({ port: 3001 }))
    .catch(err => {
        // eslint-disable-next-line
        console.log(err);
        process.exit(1);
    });
