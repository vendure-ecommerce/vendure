import { log } from '@clack/prompts';

import { readProjectLinkManifest } from '../commands/console/project-link-manifest';

/**
 * The one-line pricing hint. `@vendure/create` prints the same text after install
 * (CONSOLE_HINT in packages/create/src/console-hint.ts), with `utm_source=vendure-create`.
 * Keep both in sync: the two packages cannot share code without a new dependency.
 */
export const CONSOLE_HINT =
    'Paid plans add 30+ features and include Vendure Cloud: https://vendure.io/pricing?utm_source=vendure-dev. Already on a plan? Run `vendure console link`.';

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
