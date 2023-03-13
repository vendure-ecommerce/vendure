import { bootstrap, JobQueueService } from '@vendure/core';

import { devConfig } from './dev-config';

/**
 * This bootstraps the dev server, used for testing Vendure during development.
 */
bootstrap(devConfig)
    .then(app => {
        if (process.env.RUN_JOB_QUEUE === '1') {
            app.get(JobQueueService).start();
        }
    })
    .catch(err => {
        // eslint-disable-next-line
        console.log(err);
        process.exit(1);
    });
