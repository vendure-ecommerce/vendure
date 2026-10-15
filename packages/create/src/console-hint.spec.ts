import { describe, expect, it, vi } from 'vitest';

import { CONSOLE_HINT, showConsoleHint } from './console-hint';

describe('showConsoleHint()', () => {
    // OSS-882 - the install output points to pricing once.
    it('writes one line with the pricing URL and the link command', () => {
        const write = vi.fn();

        showConsoleHint(write);

        expect(write).toHaveBeenCalledTimes(1);
        expect(write).toHaveBeenCalledWith(CONSOLE_HINT);
        expect(CONSOLE_HINT).not.toContain('\n');
        expect(CONSOLE_HINT).toBe(
            'Paid plans add 30+ features and include Vendure Cloud: https://vendure.io/pricing?utm_source=vendure-create. Already on a plan? Run `vendure console link`.',
        );
    });
});
