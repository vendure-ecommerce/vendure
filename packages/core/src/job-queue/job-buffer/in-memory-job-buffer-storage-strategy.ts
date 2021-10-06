import { Job } from '../job';

import { JobBufferStorageStrategy } from './job-buffer-storage-strategy';

export class InMemoryJobBufferStorageStrategy implements JobBufferStorageStrategy {
    private bufferStorage = new Map<string, Set<Job>>();

    async add(processorId: string, job: Job): Promise<Job> {
        const set = this.getSet(processorId);
        set.add(job);
        return job;
    }

    async bufferSize(processorIds?: string[]): Promise<{ [processorId: string]: number }> {
        const ids = processorIds ?? Array.from(this.bufferStorage.keys());
        const result: { [processorId: string]: number } = {};
        for (const id of ids) {
            const size = this.bufferStorage.get(id)?.size ?? 0;
            result[id] = size;
        }
        return result;
    }

    async flush(processorIds?: string[]): Promise<{ [processorId: string]: Job[] }> {
        const ids = processorIds ?? Array.from(this.bufferStorage.keys());
        const result: { [processorId: string]: Job[] } = {};
        for (const id of ids) {
            const jobs = Array.from(this.bufferStorage.get(id) ?? []);
            this.bufferStorage.get(id)?.clear();
            result[id] = jobs;
        }
        return result;
    }

    private getSet(processorId: string): Set<Job> {
        const set = this.bufferStorage.get(processorId);
        if (set) {
            return set;
        } else {
            const newSet = new Set<Job>();
            this.bufferStorage.set(processorId, newSet);
            return newSet;
        }
    }
}
