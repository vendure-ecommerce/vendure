import { describe, expect, it, vi } from 'vitest';

import { CONSOLE_HINT, showConsoleHint } from './console-hint';

describe('showConsoleHint()', () => {
    // OSS-882 - the install output points to Vendure Console once.
    it('writes one line with the link command and the Console URL', () => {
        const write = vi.fn();

        showConsoleHint(write);

        expect(write).toHaveBeenCalledTimes(1);
        expect(write).toHaveBeenCalledWith(CONSOLE_HINT);
        expect(CONSOLE_HINT).not.toContain('\n');
        expect(CONSOLE_HINT).toContain('`vendure console link`');
        expect(CONSOLE_HINT).toContain('https://console.vendure.io');
    });
});
