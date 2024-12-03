import { describe, expect, it } from 'vitest';

import { getGlobalId, parseGlobalId } from './global-id';

describe('global id functions', () => {
    it('works', () => {
        // repeat the above for 10,000 randomly generated values
        for (let i = 0; i < 10_000; i++) {
            const queueId = Math.floor(Math.random() * 65535);
            const jobId = Math.floor(Math.random() * 2_000_000_000);
            const globalId = getGlobalId(queueId, jobId);
            const parsed = parseGlobalId(globalId);

            expect(parsed.queueId).toBe(queueId);
            expect(parsed.jobId).toBe(jobId);
        }
    });
});
