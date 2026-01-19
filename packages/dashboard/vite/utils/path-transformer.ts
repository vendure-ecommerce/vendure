import * as ts from 'typescript';

export interface PathTransformerOptions {
    baseUrl: string;
    paths: Record<string, string[]>;
}

/**
 * Creates a TypeScript custom transformer that rewrites import/export paths
 * from tsconfig path aliases to their resolved relative paths.
 *
 * This is necessary for ESM mode where tsconfig-paths.register() doesn't work
 * because it only hooks into CommonJS require(), not ESM import().
 *
 * The transformer assumes that both the importing file and imported file compile
 * to the same flat output directory. For complex monorepo setups with nested output
 * structures, the `pathAdapter.transformTsConfigPathMappings` callback should be
 * used to adjust paths appropriately.
 *
 * Known limitations:
 * - Only the first path target is used when multiple fallbacks are configured
 * - `require()` calls via `createRequire` are not transformed
 */
export function createPathTransformer(options: PathTransformerOptions): ts.TransformerFactory<ts.SourceFile> {
    const { paths } = options;

    // Compile the path patterns into matchers
    const pathMatchers = Object.entries(paths).map(([pattern, targets]) => {
        const hasWildcard = pattern.includes('*');

        // Escape special regex chars, then replace * with capture group
        const regexStr = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '(.*)');

        const regex = new RegExp('^' + regexStr + '$');

        return { pattern, regex, targets, hasWildcard };
    });

    return context => {
        const visitor: ts.Visitor = node => {
            // Handle import declarations: import { X } from 'module';
            if (
                ts.isImportDeclaration(node) &&
                node.moduleSpecifier &&
                ts.isStringLiteral(node.moduleSpecifier)
            ) {
                const resolvedPath = resolvePathAlias(node.moduleSpecifier.text);
                if (resolvedPath) {
                    return context.factory.updateImportDeclaration(
                        node,
                        node.modifiers,
                        node.importClause,
                        context.factory.createStringLiteral(resolvedPath),
                        node.attributes,
                    );
                }
            }

            // Handle export declarations: export { X } from 'module';
            if (
                ts.isExportDeclaration(node) &&
                node.moduleSpecifier &&
                ts.isStringLiteral(node.moduleSpecifier)
            ) {
                const resolvedPath = resolvePathAlias(node.moduleSpecifier.text);
                if (resolvedPath) {
                    return context.factory.updateExportDeclaration(
                        node,
                        node.modifiers,
                        node.isTypeOnly,
                        node.exportClause,
                        context.factory.createStringLiteral(resolvedPath),
                        node.attributes,
                    );
                }
            }

            // Handle dynamic imports: import('module')
            if (
                ts.isCallExpression(node) &&
                node.expression.kind === ts.SyntaxKind.ImportKeyword &&
                node.arguments.length > 0 &&
                ts.isStringLiteral(node.arguments[0])
            ) {
                const resolvedPath = resolvePathAlias(node.arguments[0].text);
                if (resolvedPath) {
                    return context.factory.updateCallExpression(node, node.expression, node.typeArguments, [
                        context.factory.createStringLiteral(resolvedPath),
                        ...node.arguments.slice(1),
                    ]);
                }
            }

            return ts.visitEachChild(node, visitor, context);
        };

        /**
         * Resolves a path alias to its actual path.
         * Returns undefined if the module specifier doesn't match any path alias.
         */
        function resolvePathAlias(moduleSpecifier: string): string | undefined {
            if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
                return undefined;
            }

            for (const { regex, targets, hasWildcard } of pathMatchers) {
                const match = moduleSpecifier.match(regex);
                if (match) {
                    const target = targets[0];

                    let resolved: string;
                    if (hasWildcard && match[1]) {
                        resolved = target.replace('*', match[1]);
                    } else {
                        resolved = target;
                    }

                    // Normalize to relative path with ./ prefix
                    if (resolved.startsWith('./')) {
                        resolved = resolved.substring(2);
                    }
                    resolved = './' + resolved;
                    resolved = resolved.replace(/\\/g, '/');

                    // Convert TypeScript extensions to JavaScript equivalents for ESM
                    // .ts -> .js, .tsx -> .js, .mts -> .mjs, .cts -> .cjs
                    if (resolved.endsWith('.ts') || resolved.endsWith('.tsx')) {
                        resolved = resolved.replace(/\.tsx?$/, '.js');
                    } else if (resolved.endsWith('.mts')) {
                        resolved = resolved.replace(/\.mts$/, '.mjs');
                    } else if (resolved.endsWith('.cts')) {
                        resolved = resolved.replace(/\.cts$/, '.cjs');
                    } else if (!resolved.match(/\.\w+$/)) {
                        // No extension - assume directory import, add /index.js
                        resolved += '/index.js';
                    }
                    // Files with other extensions (.json, .js, etc.) are left as-is

                    return resolved;
                }
            }

            return undefined;
        }

        return sourceFile => ts.visitNode(sourceFile, visitor) as ts.SourceFile;
    };
}
