import { describe, expect, it } from 'vitest';

import { linguiBabelPlugin } from '../vite-plugin-lingui-babel.js';

/**
 * This test verifies that the linguiBabelPlugin correctly transforms Lingui macros
 * in third-party npm packages that provide dashboard extensions.
 *
 * The bug: packages installed from npm (in node_modules) that use Lingui macros
 * were being skipped by the plugin, causing build failures with the error:
 * "The macro you imported from @lingui/react/macro is being executed outside
 * the context of compilation"
 *
 * The fix: the plugin now uses the plugin discovery mechanism to identify which
 * npm packages are Vendure plugins with dashboard extensions, and allows those
 * to be transformed.
 *
 * @see LINGUI_BABEL_PLUGIN_BUG.md
 */
describe('linguiBabelPlugin with npm packages', () => {
    // Sample code that uses Lingui macros - this is what a dashboard extension might contain
    const codeWithLinguiMacros = `
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';

export function MyComponent() {
    const greeting = t\`Hello world\`;
    return <Trans>Welcome to my plugin</Trans>;
}
`;

    // Code without Lingui macros - should always return null (no transformation needed)
    const codeWithoutLinguiMacros = `
export function MyComponent() {
    return <div>Hello</div>;
}
`;

    describe('without discovered plugins (default behavior)', () => {
        const plugin = linguiBabelPlugin();

        it('should transform Lingui macros in @vendure/dashboard source files', async () => {
            const id = '/path/to/project/node_modules/@vendure/dashboard/src/components/MyComponent.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
            expect(result?.code).toBeDefined();
            // The transformed code should NOT contain the macro imports
            expect(result?.code).not.toContain("from '@lingui/react/macro'");
            expect(result?.code).not.toContain("from '@lingui/core/macro'");
        });

        it('should transform Lingui macros in local (non-node_modules) files', async () => {
            const id = '/path/to/project/src/plugins/my-plugin/dashboard/MyComponent.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
            expect(result?.code).toBeDefined();
            expect(result?.code).not.toContain("from '@lingui/react/macro'");
        });

        it('should skip files without Lingui macro imports', async () => {
            const id = '/path/to/project/node_modules/some-package/index.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithoutLinguiMacros, id);

            expect(result).toBeNull();
        });

        it('should skip non-JS/TS files', async () => {
            const id = '/path/to/project/src/styles.css';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).toBeNull();
        });

        it('should skip unknown npm packages (not discovered as plugins)', async () => {
            // Without any discovered plugins, random npm packages should be skipped
            const id = '/path/to/project/node_modules/random-package/index.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).toBeNull();
        });
    });

    describe('with discovered plugins (simulating real-world usage)', () => {
        // Create plugin with discovered packages - simulating what happens when
        // the configLoaderPlugin discovers Vendure plugins in node_modules
        const plugin = linguiBabelPlugin({
            additionalPackagePaths: [
                '@vendure-ee/advanced-search',
                '@my-company/vendure-reviews-plugin',
                'vendure-awesome-plugin',
            ],
        });

        it('should transform Lingui macros in discovered scoped npm packages', async () => {
            const id =
                '/path/to/project/node_modules/@vendure-ee/advanced-search/dashboard/components/SearchBox.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
            expect(result?.code).toBeDefined();
            expect(result?.code).not.toContain("from '@lingui/react/macro'");
            expect(result?.code).not.toContain("from '@lingui/core/macro'");
        });

        it('should transform Lingui macros in another scoped package', async () => {
            const id = '/path/to/project/node_modules/@my-company/vendure-reviews-plugin/dashboard/index.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
            expect(result?.code).toBeDefined();
        });

        it('should transform Lingui macros in discovered unscoped npm packages', async () => {
            const id = '/path/to/project/node_modules/vendure-awesome-plugin/dashboard/index.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
            expect(result?.code).toBeDefined();
        });

        it('should transform Lingui macros in pnpm node_modules structure', async () => {
            // pnpm uses a different node_modules structure with .pnpm directory
            // The package path extraction should handle this by using lastIndexOf('node_modules/')
            const id =
                '/path/to/project/node_modules/.pnpm/@vendure-ee+advanced-search@1.0.0/node_modules/@vendure-ee/advanced-search/dashboard/SearchBox.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
            expect(result?.code).toBeDefined();
        });

        it('should still skip undiscovered npm packages', async () => {
            // A package that wasn't discovered shouldn't be transformed
            const id = '/path/to/project/node_modules/some-other-package/index.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).toBeNull();
        });

        it('should still transform @vendure/dashboard source files', async () => {
            const id = '/path/to/project/node_modules/@vendure/dashboard/src/components/Button.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
        });

        it('should still transform local files', async () => {
            const id = '/path/to/project/src/my-local-extension/dashboard/MyComponent.tsx';

            // @ts-expect-error - transform expects a different context but works for testing
            const result = await plugin.transform(codeWithLinguiMacros, id);

            expect(result).not.toBeNull();
        });
    });
});
