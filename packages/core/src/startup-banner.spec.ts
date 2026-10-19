import fs from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DefaultLogger } from './config/logger/default-logger';
import { Logger, LogLevel, VendureLogger } from './config/logger/vendure-logger';
import {
    buildStartupBanner,
    logStartupBanner,
    StartupBannerInput,
    supportsHyperlinks,
} from './startup-banner';

const identity = (text: string) => text;
const baseInput: StartupBannerInput = {
    surface: 'server',
    linked: false,
    box: true,
    hyperlinks: false,
    paint: identity,
    now: new Date('2026-10-19T12:00:00Z'),
};

describe('buildStartupBanner()', () => {
    it('draws a box of equal-width lines for an unlinked project', () => {
        const banner = buildStartupBanner(baseInput);

        expect(banner.kind).toBe('box');
        const lines = banner.text.split('\n');
        expect(lines).toHaveLength(10);
        expect(new Set(lines.map(l => l.length)).size).toBe(1);
        expect(banner.text).toContain('Vendure Platform: start your free 30-day trial');
        expect(banner.text).toContain('No card needed. Run:  vendure console link');
        expect(banner.text).toContain('vendure.io/pricing');
    });

    it('fits every row in the box on every day of the rotation', () => {
        for (let day = 0; day < 8; day++) {
            const now = new Date(Date.UTC(2026, 9, 19 + day, 12));
            const lines = buildStartupBanner({ ...baseInput, now }).text.split('\n');

            expect(new Set(lines.map(l => l.length))).toEqual(new Set([58]));
        }
    });

    it('rotates the featured capability by day', () => {
        const day1 = buildStartupBanner(baseInput).text;
        const day2 = buildStartupBanner({ ...baseInput, now: new Date('2026-10-20T12:00:00Z') }).text;

        expect(day1.match(/Today's pick: [^.]+\./)?.[0]).not.toBe(day2.match(/Today's pick: [^.]+\./)?.[0]);
    });

    it('links to the pricing page with the server utm_source', () => {
        const { text } = buildStartupBanner({ ...baseInput, hyperlinks: true });

        expect(text).toContain('\u001b]8;;https://vendure.io/pricing?utm_source=vendure-server\u0007');
    });

    it('links to the pricing page with the worker utm_source', () => {
        const { text } = buildStartupBanner({ ...baseInput, surface: 'worker', hyperlinks: true });

        expect(text).toContain('utm_source=vendure-worker');
    });

    it('keeps the box aligned when the link is a hyperlink', () => {
        const plain = buildStartupBanner(baseInput).text.split('\n');
        // eslint-disable-next-line no-control-regex
        const linked = buildStartupBanner({ ...baseInput, hyperlinks: true })
            .text.split('\n')
            .map(l => l.replace(/\u001b\]8;;[^\u0007]*\u0007/g, ''));

        expect(linked).toEqual(plain);
    });

    it('paints only the frame', () => {
        const { text } = buildStartupBanner({ ...baseInput, paint: t => `<${t}>` });

        expect(text.split('\n')[0]).toMatch(/^<╭─+╮>$/);
        expect(text).toContain('<│>  ★ Vendure Platform');
    });

    it('returns one plain line without box characters when box is false', () => {
        const banner = buildStartupBanner({ ...baseInput, box: false, surface: 'worker' });

        expect(banner.kind).toBe('line');
        expect(banner.text).not.toMatch(/[╭╮╰╯│─\u001b\n]/);
        expect(banner.text).toContain('vendure console link');
        expect(banner.text).toContain('https://vendure.io/pricing?utm_source=vendure-worker');
    });

    it('returns one plan line for a linked project, in a TTY too', () => {
        const banner = buildStartupBanner({ ...baseInput, linked: true });

        expect(banner).toEqual({
            kind: 'line',
            text: 'Manage your Vendure Platform plan: https://console.vendure.io',
        });
    });
});

describe('supportsHyperlinks()', () => {
    it('is false without a TTY', () => {
        expect(supportsHyperlinks({ TERM_PROGRAM: 'iTerm.app' }, false)).toBe(false);
    });

    it('is false in CI', () => {
        expect(supportsHyperlinks({ TERM_PROGRAM: 'iTerm.app', CI: 'true' }, true)).toBe(false);
    });

    it('is true for a known terminal in a TTY', () => {
        expect(supportsHyperlinks({ TERM_PROGRAM: 'iTerm.app' }, true)).toBe(true);
    });

    it('lets FORCE_HYPERLINK override', () => {
        expect(supportsHyperlinks({ FORCE_HYPERLINK: '1' }, false)).toBe(true);
        expect(supportsHyperlinks({ FORCE_HYPERLINK: '0', TERM_PROGRAM: 'iTerm.app' }, true)).toBe(false);
    });
});

describe('logStartupBanner()', () => {
    const originalEnv = { ...process.env };
    const originalIsTTY = process.stdout.isTTY;
    let written: string[];
    let infoLines: string[];

    function useCustomLogger() {
        const logger: VendureLogger = {
            error: () => undefined,
            warn: () => undefined,
            info: message => {
                infoLines.push(message);
            },
            verbose: () => undefined,
            debug: () => undefined,
        };
        Logger.useLogger(logger);
    }

    beforeEach(() => {
        written = [];
        infoLines = [];
        for (const key of ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'NO_COLOR', 'FORCE_HYPERLINK']) {
            delete process.env[key];
        }
        process.env.TERM = 'xterm-256color';
        Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
        vi.spyOn(process.stdout, 'write').mockImplementation((chunk: any) => {
            written.push(String(chunk));
            return true;
        });
        vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        process.env = { ...originalEnv };
        Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, configurable: true });
    });

    it('writes the box to stdout in a TTY with the default logger, unlinked', () => {
        Logger.useLogger(new DefaultLogger());

        logStartupBanner('server');

        expect(written.join('')).toContain('╭');
        expect(written.join('')).toContain('Vendure Platform: start your free 30-day trial');
    });

    it('logs one plain line without a TTY', () => {
        Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
        Logger.useLogger(new DefaultLogger());
        const info = vi.spyOn(Logger, 'info').mockImplementation(() => undefined);

        logStartupBanner('worker');

        expect(info).toHaveBeenCalledTimes(1);
        expect(info.mock.calls[0][0]).toContain('utm_source=vendure-worker');
        expect(written.join('')).not.toContain('╭');
    });

    it('logs one plain line in CI even in a TTY', () => {
        process.env.CI = 'true';
        Logger.useLogger(new DefaultLogger());
        const info = vi.spyOn(Logger, 'info').mockImplementation(() => undefined);

        logStartupBanner('server');

        expect(info).toHaveBeenCalledTimes(1);
        expect(written.join('')).not.toContain('╭');
    });

    it('logs one plain line through a custom (for example JSON) logger even in a TTY', () => {
        useCustomLogger();

        logStartupBanner('server');

        expect(infoLines).toHaveLength(1);
        expect(infoLines[0]).not.toContain('╭');
        expect(written).toEqual([]);
    });

    it('logs the plan line for a linked project', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        Logger.useLogger(new DefaultLogger());
        const info = vi.spyOn(Logger, 'info').mockImplementation(() => undefined);

        logStartupBanner('server');

        expect(info).toHaveBeenCalledWith('Manage your Vendure Platform plan: https://console.vendure.io');
        expect(written.join('')).not.toContain('╭');
    });

    it('prints nothing when the log level hides info messages', () => {
        Logger.useLogger(new DefaultLogger({ level: LogLevel.Warn }));
        const info = vi.spyOn(Logger, 'info').mockImplementation(() => undefined);

        logStartupBanner('server');

        expect(info).not.toHaveBeenCalled();
        expect(written).toEqual([]);
    });
});
