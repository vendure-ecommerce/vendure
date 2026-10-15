import { log } from '@clack/prompts';

import { readProjectLinkManifest } from '../commands/console/project-link-manifest';

/**
 * The one-line Console hint. `@vendure/create` prints the same text after install
 * (CONSOLE_HINT in packages/create/src/constants.ts). Keep both in sync: the two packages
 * cannot share code without a new dependency.
 */
export const CONSOLE_HINT =
    'Platform capabilities and Vendure Cloud are managed in Vendure Console. Run `vendure console link` or visit https://console.vendure.io';

/**
 * Prints {@link CONSOLE_HINT} unless a Project Link Manifest file exists in `projectDir`.
 * Reads one local file. It makes no network call and keeps no state.
 */
export function showConsoleHintIfUnlinked(
    projectDir: string,
    write: (message: string) => void = message => log.info(message),
): boolean {
    if (readProjectLinkManifest(projectDir).kind !== 'missing') {
        return false;
    }
    write(CONSOLE_HINT);
    return true;
}
