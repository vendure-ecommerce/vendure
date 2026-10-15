import { log } from '@clack/prompts';

/**
 * The one-line Console hint. `@vendure/cli` prints the same text for unlinked projects in
 * `vendure dev` (CONSOLE_HINT in packages/cli/src/shared/console-hint.ts). Keep both in
 * sync: the two packages cannot share code without a new dependency.
 */
export const CONSOLE_HINT =
    'Platform capabilities and Vendure Cloud are managed in Vendure Console. Run `vendure console link` or visit https://console.vendure.io';

/** Prints {@link CONSOLE_HINT}. It makes no network call and keeps no state. */
export function showConsoleHint(write: (message: string) => void = message => log.info(message)) {
    write(CONSOLE_HINT);
}
