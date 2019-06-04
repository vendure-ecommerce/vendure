/* tslint:disable:no-non-null-assertion no-empty */
import { JobState } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { Subject } from 'rxjs';

import { JobManager } from './job-manager';

describe('JobManager', () => {
    const noop = () => {};

    it('getOne() returns null for invalid id', () => {
        const jm = new JobManager();
        expect(jm.getOne('invalid')).toBeNull();
    });

    it('startJob() returns a job', () => {
        const jm = new JobManager();
        const job = jm.startJob('test', noop);
        expect(job.name).toBe('test');
    });

    it('getOne() returns job by id', () => {
        const jm = new JobManager();
        const job1 = jm.startJob('test', noop);
        const job2 = jm.getOne(job1.id);

        expect(job1.id).toBe(job2!.id);
    });

    it('job completes once work fn returns', async () => {
        const jm = new JobManager();
        const subject = new Subject();
        const job = jm.startJob('test', () => subject.toPromise());
        await tick();

        expect(jm.getOne(job.id)!.state).toBe(JobState.RUNNING);

        subject.next('result');
        subject.complete();
        await tick();

        const result = jm.getOne(job.id)!;
        expect(result.state).toBe(JobState.COMPLETED);
        expect(result.result).toBe('result');
    });

    it('job fails if work fn throws', async () => {
        const jm = new JobManager();
        const subject = new Subject();
        const job = jm.startJob('test', () => subject.toPromise());
        await tick();

        expect(jm.getOne(job.id)!.state).toBe(JobState.RUNNING);

        subject.error('oh no');
        await tick();

        const result = jm.getOne(job.id)!;
        expect(result.state).toBe(JobState.FAILED);
        expect(result.result).toBe('oh no');
    });

    it('reporter.setProgress updates job progress', async () => {
        const jm = new JobManager();
        const subject = new Subject();
        const progressSubject = new Subject<number>();
        const job = jm.startJob('test', (reporter => {
            progressSubject.subscribe(val => reporter.setProgress(val));
            return subject.toPromise();
        }));
        await tick();
        expect(jm.getOne(job.id)!.progress).toBe(0);

        progressSubject.next(10);
        expect(jm.getOne(job.id)!.progress).toBe(10);

        progressSubject.next(42);
        expect(jm.getOne(job.id)!.progress).toBe(42);

        progressSubject.next(500);
        expect(jm.getOne(job.id)!.progress).toBe(100);

        progressSubject.next(88);
        expect(jm.getOne(job.id)!.progress).toBe(88);

        subject.complete();
        await tick();

        const result = jm.getOne(job.id)!;
        expect(jm.getOne(job.id)!.progress).toBe(100);
    });

    it('getAll() returns all jobs', () => {
        const jm = new JobManager();
        const job1 = jm.startJob('job1', noop);
        const job2 = jm.startJob('job2', noop);
        const job3 = jm.startJob('job3', noop);

        expect(jm.getAll().map(j => j.id)).toEqual([job1.id, job2.id, job3.id]);
    });

    it('getAll() filters by id', () => {
        const jm = new JobManager();
        const job1 = jm.startJob('job1', noop);
        const job2 = jm.startJob('job2', noop);
        const job3 = jm.startJob('job3', noop);

        expect(jm.getAll({ ids: [job1.id, job3.id]}).map(j => j.id)).toEqual([job1.id, job3.id]);
    });

    it('getAll() filters by state', async () => {
        const jm = new JobManager();
        const subject = new Subject();
        const job1 = jm.startJob('job1', noop);
        const job2 = jm.startJob('job2', noop);
        const job3 = jm.startJob('job3', () => subject.toPromise());

        await tick();

        expect(jm.getAll({ state: JobState.COMPLETED}).map(j => j.id)).toEqual([job1.id, job2.id]);
        expect(jm.getAll({ state: JobState.RUNNING}).map(j => j.id)).toEqual([job3.id]);
    });

    it('clean() removes completed jobs older than maxAge', async () => {
        const jm = new JobManager('10ms');
        const subject1 = new Subject();
        const subject2 = new Subject();

        const job1 = jm.startJob('job1', () => subject1.toPromise());
        const job2 = jm.startJob('job2', () => subject2.toPromise());

        subject1.complete();
        await tick();

        jm.clean();

        expect(jm.getAll().map(pick(['name', 'state']))).toEqual([
            { name: 'job1', state: JobState.COMPLETED },
            { name: 'job2', state: JobState.RUNNING },
        ]);

        await tick(20);

        jm.clean();

        expect(jm.getAll().map(pick(['name', 'state']))).toEqual([
            { name: 'job2', state: JobState.RUNNING },
        ]);
    });
});

function tick(duration: number = 0) {
    return new Promise(resolve => global.setTimeout(resolve, duration));
}
