import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';

import { DefaultLogger } from './config/logger/default-logger';
import { Logger, LogLevel } from './config/logger/vendure-logger';
import { isCI } from './telemetry/helpers/ci-detector.helper';

export type StartupBannerSurface = 'server' | 'worker';

const PRICING_URL = 'https://vendure.io/pricing';
const CONSOLE_URL = 'https://console.vendure.io';
const LINK_COMMAND = 'vendure console link';
const BOX_INNER_WIDTH = 56;
// The Vendure brand color (#17C1FF). Terminals without 24-bit color get cyan.
const BRAND_RGB = '38;2;23;193;255';

/**
 * Static copy. Core makes no network call at startup, so the text ships with the package.
 * Keep it short and generic. The list names Platform capabilities and does not promise details.
 * A description must fit on one box line (52 characters).
 */
const FEATURED_CAPABILITIES: ReadonlyArray<{ name: string; description: string }> = [
    { name: 'Quotes', description: 'Let B2B buyers request and negotiate prices.' },
    { name: 'B2B accounts', description: 'Company accounts with several buyers and roles.' },
    { name: 'Shopping lists', description: 'Shared, reusable lists for repeat buyers.' },
    { name: 'Advanced search', description: 'Faceted product search for large catalogs.' },
    { name: 'Contract pricing', description: 'Negotiated prices per customer or company.' },
    { name: 'Approvals', description: 'Route orders to an approver before they go through.' },
    { name: 'Admin access policies', description: 'Rules for who can do what in the Dashboard.' },
    { name: 'Configurator', description: 'Let buyers configure made-to-order products.' },
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface StartupBannerInput {
    surface: StartupBannerSurface;
    /** Whether `.vendure/project.json` exists in the working directory. */
    linked: boolean;
    /** Whether to draw the box. When false, the banner is one plain line. */
    box: boolean;
    hyperlinks: boolean;
    /** Colors the box frame. Pass an identity function for no color. */
    paint: (text: string) => string;
    now: Date;
}

export type StartupBanner = { kind: 'box'; text: string } | { kind: 'line'; text: string };

/**
 * Whether the terminal renders OSC 8 hyperlinks. `FORCE_HYPERLINK` overrides the other checks.
 * Without it, a non-TTY stdout or a CI run gets no hyperlink.
 *
 * This is a copy of `supportsHyperlinks` in `packages/cli/src/shared/console-hint.ts`. Core cannot
 * import the CLI. Keep both in sync.
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
    if (['xterm-kitty', 'xterm-ghostty', 'alacritty', 'foot', 'foot-extra'].includes(env.TERM ?? '')) {
        return true;
    }
    return Number.parseInt(env.VTE_VERSION ?? '', 10) >= 5000;
}

export function buildStartupBanner(input: StartupBannerInput): StartupBanner {
    const { surface, linked, box, hyperlinks, paint, now } = input;
    if (linked) {
        return { kind: 'line', text: `Manage your Vendure Platform plan: ${CONSOLE_URL}` };
    }
    const pricingUrl = `${PRICING_URL}?utm_source=vendure-${surface}`;
    if (!box) {
        return {
            kind: 'line',
            text: `Vendure Platform: start your free 30-day trial. No card needed. Run: ${LINK_COMMAND} (${pricingUrl})`,
        };
    }

    const index = Math.floor(now.getTime() / MS_PER_DAY) % FEATURED_CAPABILITIES.length;
    const pick = FEATURED_CAPABILITIES[index];
    // Name as many other capabilities as fit on one line.
    const contentWidth = BOX_INNER_WIDTH - 2;
    let also = 'Also:';
    for (let offset = 1; offset < FEATURED_CAPABILITIES.length; offset++) {
        const name = FEATURED_CAPABILITIES[(index + offset) % FEATURED_CAPABILITIES.length].name;
        const next = `${also}${offset === 1 ? ' ' : ', '}${name}`;
        if (next.length > contentWidth) {
            break;
        }
        also = next;
    }
    const linkLabel = 'vendure.io/pricing';
    const link = hyperlinks ? `\u001b]8;;${pricingUrl}\u0007${linkLabel}\u001b]8;;\u0007` : linkLabel;

    // The hyperlink escape adds no visible width, so the last row pads by its label.
    const rows: Array<[visible: string, rendered: string]> = [
        ...[
            '★ Vendure Platform: start your free 30-day trial',
            '',
            `Today's pick: ${pick.name}.`,
            pick.description,
            also,
            '',
            `No card needed. Run:  ${LINK_COMMAND}`,
        ].map((text): [string, string] => [text, text]),
        [linkLabel, link],
    ];
    const horizontal = '─'.repeat(BOX_INNER_WIDTH);
    const lines = [
        paint(`╭${horizontal}╮`),
        ...rows.map(([visible, rendered]) => {
            const padding = ' '.repeat(contentWidth - visible.length);
            return `${paint('│')}  ${rendered}${padding}${paint('│')}`;
        }),
        paint(`╰${horizontal}╯`),
    ];
    return { kind: 'box', text: lines.join('\n') };
}

function brandPainter(): (text: string) => string {
    if (!pc.isColorSupported) {
        return text => text;
    }
    const { COLORTERM } = process.env;
    if (COLORTERM === 'truecolor' || COLORTERM === '24bit') {
        return text => `\u001b[${BRAND_RGB}m${text}\u001b[39m`;
    }
    return pc.cyan;
}

/**
 * Logs the Vendure Platform banner as the last startup output of the server or worker.
 *
 * An interactive terminal with the default logger gets a colored box on stdout. Everything else
 * (no TTY, CI, a custom logger such as a JSON logger) gets one plain `Logger` line. Reads one
 * local file and makes no network call.
 */
export function logStartupBanner(surface: StartupBannerSurface): void {
    const logger = Logger.logger;
    if (logger instanceof DefaultLogger && logger.level < LogLevel.Info) {
        return;
    }
    const interactive =
        logger instanceof DefaultLogger &&
        process.stdout.isTTY === true &&
        !isCI() &&
        process.env.TERM !== 'dumb';
    const banner = buildStartupBanner({
        surface,
        linked: fs.existsSync(path.join(process.cwd(), '.vendure', 'project.json')),
        box: interactive,
        hyperlinks: supportsHyperlinks(),
        paint: brandPainter(),
        now: new Date(),
    });
    if (banner.kind === 'box') {
        process.stdout.write(`${banner.text}\n`);
    } else {
        Logger.info(banner.text);
    }
}
