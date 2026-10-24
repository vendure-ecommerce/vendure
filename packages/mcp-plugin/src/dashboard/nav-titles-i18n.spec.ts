import { setupI18n } from '@lingui/core';
import { formatter } from '@lingui/format-po';
import { compileMessage } from '@lingui/message-utils/compileMessage';
import { generateMessageId } from '@lingui/message-utils/generateMessageId';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

/**
 * #5641 — the dashboard shell renders a nav title as a Lingui message *id*
 * (`i18n.t(item.title)` in `nav-main.tsx`), so a title only translates if the catalogs contain
 * an entry keyed by the title text itself. Lingui only keys an entry that way when the string
 * literal carries a `/* i18n*\/` comment, which makes `lingui extract` record it as an explicit
 * id; otherwise the entry is keyed by a hash of the source text and the lookup misses, falling
 * back to English and logging "Uncompiled message detected!" on every sidebar render.
 */
describe('dashboard nav titles', () => {
    const dashboardDir = resolve(__dirname);
    const i18nDir = join(dashboardDir, 'i18n');
    const sourceLocale = 'en';
    const sourceFiles = readdirSync(dashboardDir).filter(name => name.endsWith('.tsx'));

    /** The index of the quote closing the literal that opens at `from - 1`, honouring escapes. */
    function endOfStringLiteral(source: string, from: number, quote: string): number {
        for (let i = from; i < source.length; i++) {
            if (source[i] === '\\') {
                i++;
            } else if (source[i] === quote) {
                return i;
            }
        }
        return source.length;
    }

    /**
     * The source of each `navSections: [...]` / `navMenuItem: {...}` declaration, so that an
     * unrelated `title:` in a page component is not mistaken for a nav title. Scanning to the
     * matching bracket keeps every section of a multi-section `navSections` array in scope.
     *
     * Brackets inside string literals and comments are skipped, so a title such as `'Tools [beta]'`
     * neither cuts its block short nor extends it past its real end into unrelated declarations.
     */
    function navBlocks(source: string): string[] {
        return [...source.matchAll(/\bnav(?:Sections|MenuItem)\s*:\s*[[{]/g)].flatMap(match => {
            const start = match.index + match[0].length - 1;
            const open = source[start];
            const close = open === '[' ? ']' : '}';
            let depth = 0;
            for (let i = start; i < source.length; i++) {
                const char = source[i];
                if (char === "'" || char === '"' || char === '`') {
                    i = endOfStringLiteral(source, i + 1, char);
                } else if (char === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
                    const lineComment = source[i + 1] === '/';
                    const end = source.indexOf(lineComment ? '\n' : '*/', i + 2);
                    if (end === -1) {
                        break;
                    }
                    i = lineComment ? end : end + 1;
                } else if (char === open) {
                    depth++;
                } else if (char === close && --depth === 0) {
                    return [source.slice(start, i + 1)];
                }
            }
            return [];
        });
    }

    /** Titles declared on a nav section or on a route's nav menu item, with their marker comment. */
    function navTitles(): { found: Array<{ file: string; title: string; marked: boolean }>; keys: number } {
        const titleLiteral = /\btitle:\s*(\/\*\s*i18n\s*\*\/)?\s*(['"])(.+?)\2/g;
        const found: Array<{ file: string; title: string; marked: boolean }> = [];
        let keys = 0;
        for (const file of sourceFiles) {
            for (const block of navBlocks(readFileSync(join(dashboardDir, file), 'utf8'))) {
                keys += block.match(/\btitle:/g)?.length ?? 0;
                found.push(
                    ...[...block.matchAll(titleLiteral)].map(match => ({
                        file,
                        title: match[3],
                        marked: match[1] !== undefined,
                    })),
                );
            }
        }
        return { found, keys };
    }

    /**
     * The texts the plugin's own `<Trans>` breadcrumbs and headings contribute to the catalogs.
     *
     * Only plain `<Trans>text</Trans>` is recognised: a title rendered through `t`/`i18n._` or an
     * interpolating `<Trans>` is not seen here, so the hashed-entry cross-check below would skip
     * it rather than fail. That only ever loosens the assertions, never the fix.
     */
    function transTexts(): Set<string> {
        return new Set(
            sourceFiles.flatMap(file =>
                [
                    ...readFileSync(join(dashboardDir, file), 'utf8').matchAll(/<Trans>([^<>{}]+)<\/Trans>/g),
                ].map(match => match[1].trim()),
            ),
        );
    }

    /** Parses a catalog the way `lingui compile` and the dashboard's Vite plugin do. */
    async function parseCatalog(catalogFile: string) {
        const filename = join(i18nDir, catalogFile);
        return formatter().parse(readFileSync(filename, 'utf8'), {
            locale: catalogFile.replace(/\.po$/, ''),
            sourceLocale,
            filename,
        });
    }

    /**
     * The text the dashboard ends up rendering for `id`: the locale's own translation, else the
     * source locale's, as `createMergedMessageMap()` in `vite-plugin-translations.ts` resolves it
     * via `catalog.getTranslations(locale, { fallbackLocales: { default: sourceLocale } })`.
     *
     * Deliberate duplication: checked against `packages/dashboard/vite/vite-plugin-translations.ts`
     * (and against its real output for these titles), so keep the two in step.
     */
    function resolveMessage(
        catalog: Record<string, { message?: string; translation?: string }>,
        source: Record<string, { message?: string; translation?: string }>,
        id: string,
    ): string | undefined {
        const entry = catalog[id];
        return entry?.translation || source[id]?.translation || entry?.message;
    }

    const { found: titles, keys: titleKeys } = navTitles();
    const transTitles = transTexts();
    const catalogFiles = readdirSync(i18nDir).filter(name => name.endsWith('.po'));

    it('finds the nav titles in the dashboard sources', () => {
        expect(titles.map(t => t.title).sort()).toEqual([
            'Activity',
            'Grants',
            'MCP Server',
            'Overview',
            'Tools',
        ]);
        // Every `title:` in a nav declaration was read as a string literal above; one built from a
        // variable or a helper would not be covered by the cases below.
        expect(titles.length).toBe(titleKeys);
        expect(catalogFiles).toContain(`${sourceLocale}.po`);
    });

    it.each(titles)('$file marks "$title" for extraction as an explicit id', ({ marked }) => {
        expect(marked).toBe(true);
    });

    it.each(catalogFiles)('%s resolves every nav title under its explicit id', async catalogFile => {
        const catalog = await parseCatalog(catalogFile);
        const source = await parseCatalog(`${sourceLocale}.po`);
        for (const { title } of titles) {
            // The sidebar looks the title up by the title text...
            expect(catalog[title], `no explicit-id entry for "${title}"`).toBeDefined();
            const explicit = resolveMessage(catalog, source, title);
            expect(explicit, `"${title}" resolves to nothing`).toBeTruthy();
            // ...while a page that says the same words in a <Trans> is keyed by a hash of them.
            // Where both exist they must agree, or the sidebar and the page would disagree.
            if (transTitles.has(title)) {
                const hashedId = generateMessageId(title);
                expect(catalog[hashedId], `no hashed-id entry for "${title}"`).toBeDefined();
                expect(explicit, `translation mismatch for "${title}"`).toBe(
                    resolveMessage(catalog, source, hashedId),
                );
            }
        }
    });

    it.each(catalogFiles)('%s renders every nav title without a Lingui warning', async catalogFile => {
        const locale = catalogFile.replace(/\.po$/, '');
        const catalog = await parseCatalog(catalogFile);
        const source = await parseCatalog(`${sourceLocale}.po`);
        const messages = Object.fromEntries(
            Object.keys(catalog).map(id => [id, compileMessage(resolveMessage(catalog, source, id) ?? '')]),
        );
        // Only a production build warns: outside one the I18n constructor installs a runtime
        // message compiler, which is why #5641 is invisible in development.
        const nodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        let rendered: Array<string | undefined>;
        let warnings: string[];
        try {
            const i18n = setupI18n();
            i18n.load(locale, messages);
            i18n.activate(locale);
            // The lookup `nav-main.tsx` performs. A miss returns the raw id and makes
            // @lingui/core log "Uncompiled message detected!", the symptom reported in #5641.
            rendered = titles.map(({ title }) => i18n.t(title));
            warnings = warn.mock.calls.map(([message]) => String(message).split('\n')[0]);
        } finally {
            warn.mockRestore();
            if (nodeEnv === undefined) {
                delete process.env.NODE_ENV;
            } else {
                process.env.NODE_ENV = nodeEnv;
            }
        }
        expect(warnings, `Lingui warnings for ${catalogFile}`).toEqual([]);
        expect(rendered, `rendered titles for ${catalogFile}`).toEqual(
            titles.map(({ title }) => resolveMessage(catalog, source, title)),
        );
    });

    // 27 of the 28 catalogs have no translation of their own for most of these titles, and an
    // explicit-id entry carries no source text to fall back to, so a blank msgstr here would blank
    // the sidebar label in every other locale.
    it.each(titles)(
        `${sourceLocale}.po translates "$title" for the other locales to fall back to`,
        async ({ title }) => {
            const source = await parseCatalog(`${sourceLocale}.po`);
            expect(source[title]?.translation, `empty msgstr for "${title}"`).toBeTruthy();
        },
    );
});
