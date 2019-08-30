import { PartialJobReporter } from '../../services/job.service';

import { Job } from './job';

describe('Job', () => {
    it('does not run work more than once', () => {
        let counter = 0;
        const mockReporter: PartialJobReporter = {
            complete: (result?: any) => {
                /**/
            },
        };
        const job = new Job(
            'test',
            () => {
                counter++;
                return new Promise(() => {
                    /**/
                });
            },
            mockReporter,
        );
        job.start();

        expect(counter).toBe(1);

        job.start();

        expect(counter).toBe(1);
    });
});
