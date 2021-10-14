import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
.then(worker => worker.startJobQueue())
.catch(err => {
    // tslint:disable-next-line:no-console
    console.log(err);
});
