import { parse } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import fs from 'fs-extra';
import path from 'path';
import * as ts from 'typescript';

import { Logger, PluginInfo, TransformTsConfigPathMappingsFn } from '../types.js';

export async function discoverPlugins(
    vendureConfigPath: string,
    transformTsConfigPathMappings: TransformTsConfigPathMappingsFn,
    filePaths: string[],
    logger: Logger,
): Promise<PluginInfo[]> {
    const plugins: PluginInfo[] = [];

    // Discover local plugins before compilation
    const localPluginMap = await discoverLocalPlugins(
        vendureConfigPath,
        logger,
        transformTsConfigPathMappings,
    );
    logger.debug(
        `[discoverPlugins] Found ${localPluginMap.size} local plugins: ${JSON.stringify([...localPluginMap.entries()], null, 2)}`,
    );

    for (const filePath of filePaths) {
        const content = await fs.readFile(filePath, 'utf-8');
        logger.debug(`[discoverPlugins] Checking file ${filePath}`);

        // First check if this file imports from @vendure/core
        if (!content.includes('@vendure/core')) {
            continue;
        }

        try {
            const ast = parse(content, {
                ecmaVersion: 'latest',
                sourceType: 'module',
            });

            let hasVendurePlugin = false;
            let pluginName: string | undefined;
            let dashboardPath: string | undefined;

            // Walk the AST to find the plugin class and its decorator
            walkSimple(ast, {
                CallExpression(node: any) {
                    // Look for __decorate calls
                    if (node.callee.name === '__decorate') {
                        const args = node.arguments;
                        if (args.length >= 2) {
                            // Check the decorators array (first argument)
                            const decorators = args[0];
                            if (decorators.type === 'ArrayExpression') {
                                for (const decorator of decorators.elements) {
                                    if (
                                        decorator.type === 'CallExpression' &&
                                        decorator.arguments.length === 1 &&
                                        decorator.arguments[0].type === 'ObjectExpression'
                                    ) {
                                        // Look for the dashboard property in the decorator config
                                        const props = decorator.arguments[0].properties;
                                        for (const prop of props) {
                                            if (
                                                prop.key.name === 'dashboard' &&
                                                prop.value.type === 'Literal'
                                            ) {
                                                dashboardPath = prop.value.value;
                                                hasVendurePlugin = true;
                                            }
                                        }
                                    }
                                }
                            }
                            // Get the plugin class name (second argument)
                            const targetClass = args[1];
                            if (targetClass.type === 'Identifier') {
                                pluginName = targetClass.name;
                            }
                        }
                    }
                },
            });

            if (hasVendurePlugin && pluginName && dashboardPath) {
                logger.debug(`[discoverPlugins] Found plugin "${pluginName}" in file: ${filePath}`);
                // Keep the dashboard path relative to the plugin file
                const resolvedDashboardPath = dashboardPath.startsWith('.')
                    ? dashboardPath // Keep the relative path as-is
                    : './' + path.relative(path.dirname(filePath), dashboardPath); // Make absolute path relative

                // Check if this is a local plugin we found earlier
                const sourcePluginPath = localPluginMap.get(pluginName);

                plugins.push({
                    name: pluginName,
                    pluginPath: filePath,
                    dashboardEntryPath: resolvedDashboardPath,
                    ...(sourcePluginPath && { sourcePluginPath }),
                });
            }
        } catch (e) {
            logger.error(`Failed to parse ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    return plugins;
}

/**
 * Discovers local Vendure plugins by analyzing TypeScript files starting from the config file.
 *
 * Returns a map of plugin name to local source path.
 */
export async function discoverLocalPlugins(
    vendureConfigPath: string,
    logger: Logger,
    transformTsConfigPathMappings: TransformTsConfigPathMappingsFn,
): Promise<Map<string, string>> {
    const sourcePluginMap = new Map<string, string>();
    const visitedFiles = new Set<string>();
    const configDir = path.dirname(vendureConfigPath);

    // Get tsconfig paths for resolving aliases
    const tsConfigInfo = await findTsConfigPaths(
        vendureConfigPath,
        logger,
        'compiling',
        transformTsConfigPathMappings,
    );

    async function processFile(filePath: string) {
        if (visitedFiles.has(filePath)) {
            return;
        }
        visitedFiles.add(filePath);

        try {
            // First check if this is a directory
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                // If it's a directory, try to find the plugin file
                const indexFilePath = path.join(filePath, 'index.ts');
                if (await fs.pathExists(indexFilePath)) {
                    await processFile(indexFilePath);
                }
                return;
            }

            const content = await fs.readFile(filePath, 'utf-8');
            const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

            // Track imports to follow
            const importsToFollow: string[] = [];

            function visit(node: ts.Node) {
                // Look for VendurePlugin decorator
                if (ts.isClassDeclaration(node)) {
                    const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
                    if (decorators?.length) {
                        for (const decorator of decorators) {
                            const decoratorName = getDecoratorName(decorator);
                            if (decoratorName === 'VendurePlugin') {
                                const className = node.name?.text;
                                if (className) {
                                    sourcePluginMap.set(className, filePath);
                                    logger.debug(`Found plugin "${className}" at ${filePath}`);
                                }
                            }
                        }
                    }
                }

                // Handle both imports and exports
                if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                    const moduleSpecifier = node.moduleSpecifier;
                    if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
                        const importPath = moduleSpecifier.text;
                        // Handle path aliases and local imports
                        if (tsConfigInfo) {
                            // Check if this import matches any path mapping
                            for (const [alias, patterns] of Object.entries(tsConfigInfo.paths)) {
                                const aliasPattern = alias.replace(/\*$/, '');
                                if (importPath.startsWith(aliasPattern)) {
                                    const relativePart = importPath.slice(aliasPattern.length);
                                    // Try each pattern
                                    for (const pattern of patterns) {
                                        const resolvedPattern = pattern.replace(/\*$/, '');
                                        const resolvedPath = path.resolve(
                                            tsConfigInfo.baseUrl,
                                            resolvedPattern,
                                            relativePart,
                                        );
                                        importsToFollow.push(resolvedPath);
                                    }
                                }
                            }
                        }
                        // Also handle local imports
                        if (importPath.startsWith('.')) {
                            const resolvedPath = path.resolve(path.dirname(filePath), importPath);
                            importsToFollow.push(resolvedPath);
                        }
                    }
                }

                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            // Follow imports
            for (const importPath of importsToFollow) {
                // Try all possible file paths
                const possiblePaths = [
                    importPath + '.ts',
                    importPath + '.js',
                    path.join(importPath, 'index.ts'),
                    path.join(importPath, 'index.js'),
                ];

                // Try each possible path
                let found = false;
                for (const possiblePath of possiblePaths) {
                    if (await fs.pathExists(possiblePath)) {
                        await processFile(possiblePath);
                        found = true;
                        break;
                    }
                }

                // If none of the file paths worked, try the raw import path
                // (it might be a directory)
                if (!found && (await fs.pathExists(importPath))) {
                    await processFile(importPath);
                }
            }
        } catch (e) {
            logger.error(`Failed to process ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    await processFile(vendureConfigPath);
    return sourcePluginMap;
}

function getDecoratorName(decorator: ts.Decorator): string | undefined {
    if (ts.isCallExpression(decorator.expression)) {
        const expression = decorator.expression.expression;
        // Handle both direct usage and imported usage
        if (ts.isIdentifier(expression)) {
            return expression.text;
        }
        // Handle property access like `Decorators.VendurePlugin`
        if (ts.isPropertyAccessExpression(expression)) {
            return expression.name.text;
        }
    }
    return undefined;
}

/**
 * Finds and parses tsconfig files in the given directory and its parent directories.
 */
async function findTsConfigPaths(
    configPath: string,
    logger: Logger,
    phase: 'compiling' | 'loading',
    transformTsConfigPathMappings: (params: {
        phase: 'compiling' | 'loading';
        alias: string;
        patterns: string[];
    }) => string[],
): Promise<{ baseUrl: string; paths: Record<string, string[]> } | undefined> {
    const configDir = path.dirname(configPath);
    let currentDir = configDir;

    while (currentDir !== path.parse(currentDir).root) {
        try {
            const files = await fs.readdir(currentDir);
            const tsConfigFiles = files.filter(file => /^tsconfig(\..*)?\.json$/.test(file));

            for (const fileName of tsConfigFiles) {
                const tsConfigPath = path.join(currentDir, fileName);
                try {
                    const tsConfigContent = await fs.readFile(tsConfigPath, 'utf-8');
                    const tsConfig = JSON.parse(tsConfigContent);
                    const compilerOptions = tsConfig.compilerOptions || {};

                    if (compilerOptions.paths) {
                        const tsConfigBaseUrl = path.resolve(currentDir, compilerOptions.baseUrl || '.');
                        const paths: Record<string, string[]> = {};

                        for (const [alias, patterns] of Object.entries(compilerOptions.paths)) {
                            const normalizedPatterns = (patterns as string[]).map(pattern =>
                                pattern.replace(/\\/g, '/'),
                            );
                            paths[alias] = transformTsConfigPathMappings({
                                phase,
                                alias,
                                patterns: normalizedPatterns,
                            });
                        }
                        return { baseUrl: tsConfigBaseUrl, paths };
                    }
                } catch (e) {
                    logger.warn(
                        `Could not read or parse tsconfig file ${tsConfigPath}: ${e instanceof Error ? e.message : String(e)}`,
                    );
                }
            }
        } catch (e) {
            logger.warn(
                `Could not read directory ${currentDir}: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
        currentDir = path.dirname(currentDir);
    }
    return undefined;
}
