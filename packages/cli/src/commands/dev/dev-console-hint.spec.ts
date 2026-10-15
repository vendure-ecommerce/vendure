import { EventEmitter } from 'node:events';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CONSOLE_HINT } from '../../shared/console-hint';

const { infoMock, spawnMock } = vi.hoisted(() => ({ infoMock: vi.fn(), spawnMock: vi.fn() }));

vi.mock('@clack/prompts', async importOriginal => {
    const actual = await importOriginal<typeof import('@clack/prompts')>();
    return { ...actual, log: Object.assign({}, actual.log, { info: infoMock }) };
});
vi.mock('node:child_process', async importOriginal => ({
    ...(await importOriginal<typeof import('node:child_process')>()),
    spawn: spawnMock,
}));
vi.mock('../../shared/cli-process-utils', async importOriginal => ({
    ...(await importOriginal<typeof import('../../shared/cli-process-utils')>()),
    resolvePackageBin: () => '/fake/bin.js',
}));

import { devCommand } from './dev';

describe('devCommand() Console hint', () => {
    let projectDir: string;

    beforeEach(() => {
        projectDir = mkdtempSync(path.join(tmpdir(), 'vendure-cli-dev-hint-'));
        mkdirSync(path.join(projectDir, 'src'));
        writeFileSync(path.join(projectDir, 'src', 'index.ts'), '');
        writeFileSync(
            path.join(projectDir, 'package.json'),
            JSON.stringify({ dependencies: { '@vendure/core': '3.8.0' } }),
        );
        // A child that exits cleanly as soon as the dev command starts waiting on it.
        spawnMock.mockImplementation(() => {
            const child = Object.assign(new EventEmitter(), {
                exitCode: null,
                signalCode: null,
                kill: vi.fn(),
            });
            setImmediate(() => child.emit('close', 0, null));
            return child;
        });
    });

    afterEach(() => {
        rmSync(projectDir, { recursive: true, force: true });
        infoMock.mockReset();
        spawnMock.mockReset();
    });

    // OSS-882 - an unlinked project sees the hint once per process start.
    it('prints the hint once for an unlinked project', async () => {
        const exitCode = await devCommand('server', { project: projectDir, reload: false });

        expect(exitCode).toBe(0);
        expect(infoMock.mock.calls.filter(([message]) => message === CONSOLE_HINT)).toHaveLength(1);
    });

    // OSS-882 - a linked project (.vendure/project.json present) prints nothing.
    it('prints nothing for a linked project', async () => {
        mkdirSync(path.join(projectDir, '.vendure'));
        writeFileSync(path.join(projectDir, '.vendure', 'project.json'), '{}');

        await devCommand('server', { project: projectDir, reload: false });

        expect(infoMock).not.toHaveBeenCalledWith(CONSOLE_HINT);
    });
});
