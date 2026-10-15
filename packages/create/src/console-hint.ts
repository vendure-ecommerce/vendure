import { log } from '@clack/prompts';

// The pricing URL shown in the hint, and the tag that names the surface that printed it.
const PRICING_URL = 'https://vendure.io/pricing';
const UTM_SOURCE = 'vendure-create';

/**
 * Whether the terminal renders OSC 8 hyperlinks. `FORCE_HYPERLINK` overrides the other checks.
 * Without it, a non-TTY stdout or a CI run gets no hyperlink. The terminal checks follow the
 * `supports-hyperlinks` package, which neither package depends on.
 */
export function supportsHyperlinks(
    env: NodeJS.ProcessEnv = process.env,
    isTTY: boolean = process.stdout.isTTY === true,
): boolean {
    if (env.FORCE_HYPERLINK) {
        return parseInt(env.FORCE_HYPERLINK, 10) !== 0;
    }
    if (!isTTY || env.CI || env.TEAMCITY_VERSION) {
        return false;
    }
    if (env.WT_SESSION) {
        return true;
    }
    if (['iTerm.app', 'vscode', 'WezTerm', 'WarpTerminal'].includes(env.TERM_PROGRAM ?? '')) {
        return true;
    }
    return Number.parseInt(env.VTE_VERSION ?? '', 10) >= 5000;
}

/**
 * The hint line. A terminal with hyperlink support shows `https://vendure.io/pricing` and links
 * to it with the `utm_source` tag. Other terminals get the plain URL without the tag.
 * `packages/cli/src/shared/console-hint.ts` holds the same text with `utm_source=vendure-dev`. Keep both in sync: the two
 * packages cannot share code without a new dependency.
 */
export function getConsoleHint(hyperlinks: boolean = supportsHyperlinks()): string {
    const link = hyperlinks
        ? `\u001b]8;;${PRICING_URL}?utm_source=${UTM_SOURCE}\u0007${PRICING_URL}\u001b]8;;\u0007`
        : PRICING_URL;
    return `Paid plans add 30+ features and include Vendure Cloud: ${link}. Already on a plan? Run \`vendure console link\`.`;
}

/** Prints {@link getConsoleHint}. It makes no network call and keeps no state. */
export function showConsoleHint(write: (message: string) => void = message => log.info(message)) {
    write(getConsoleHint());
}
