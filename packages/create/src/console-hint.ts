import { log } from '@clack/prompts';

/**
 * The one-line pricing hint. `@vendure/cli` prints the same text for unlinked projects in
 * `vendure dev` (CONSOLE_HINT in packages/cli/src/shared/console-hint.ts), with
 * `utm_source=vendure-dev`. Keep both in sync: the two packages cannot share code without
 * a new dependency.
 */
export const CONSOLE_HINT =
    'Paid plans add 30+ features and include Vendure Cloud: https://vendure.io/pricing?utm_source=vendure-create. Already on a plan? Run `vendure console link`.';

/** Prints {@link CONSOLE_HINT}. It makes no network call and keeps no state. */
export function showConsoleHint(write: (message: string) => void = message => log.info(message)) {
    write(CONSOLE_HINT);
}
