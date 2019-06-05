import { Job } from './job';

describe('Job', () => {
    it('does not run work more than once', () => {
        let counter = 0;
        const job = new Job('test', () => {
            counter++;
            return new Promise(() => {});
        });
        job.start();

        expect(counter).toBe(1);

        job.start();

        expect(counter).toBe(1);
    });
});
