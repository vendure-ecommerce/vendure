import { VendureConfig } from '@vendure/core';
import { parse } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import glob from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';
import tsConfigPaths from 'tsconfig-paths';
import * as ts from 'typescript';
import { fileURLToPath, pathToFileURL } from 'url';

import { findConfigExport } from './ast-utils.js';

type Logger = {
    info: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
};

export type PluginInfo = {
    name: string;
    pluginPath: string;
    dashboardEntryPath: string | undefined;
};

const defaultLogger: Logger = {
    info: (message: string) => {
        console.log(message);
    },
    warn: (message: string) => {
        console.warn(message);
    },
    debug: (message: string) => {
        console.debug(message);
    },
};

/**
 * @description
 * The PathAdapter interface allows customization of how paths are handled
 * when compiling the Vendure config and its imports.
 */
export interface PathAdapter {
    /**
     * @description
     * A function to determine the path to the compiled Vendure config file.
     */
    getCompiledConfigPath?: (params: {
        inputRootDir: string;
        outputPath: string;
        configFileName: string;
    }) => string;
    /**
     * If your project makes use of the TypeScript `paths` configuration, the compiler will
     * attempt to use these paths when compiling the Vendure config and its imports.
     */
    transformTsConfigPathMappings?: (params: {
        phase: 'compiling' | 'loading';
        alias: string;
        patterns: string[];
    }) => string[];
}

const defaultPathAdapter: Required<PathAdapter> = {
    getCompiledConfigPath: ({ outputPath, configFileName }) => path.join(outputPath, configFileName),
    transformTsConfigPathMappings: ({ patterns }) => patterns,
};

export interface CompilerOptions {
    vendureConfigPath: string;
    outputPath: string;
    pathAdapter?: PathAdapter;
    logger?: Logger;
}

export interface CompileResult {
    vendureConfig: VendureConfig;
    exportedSymbolName: string;
    pluginInfo: PluginInfo[];
}

/**
 * Compiles TypeScript files and discovers Vendure plugins in both the compiled output
 * and in node_modules.
 */
export async function compile(options: CompilerOptions): Promise<CompileResult> {
    const { vendureConfigPath, outputPath, pathAdapter, logger = defaultLogger } = options;
    const getCompiledConfigPath =
        pathAdapter?.getCompiledConfigPath ?? defaultPathAdapter.getCompiledConfigPath;
    const transformTsConfigPathMappings =
        pathAdapter?.transformTsConfigPathMappings ?? defaultPathAdapter.transformTsConfigPathMappings;

    logger.info('Starting compilation process...');
    const startTime = Date.now();

    // 1. Compile TypeScript files
    const compileStart = Date.now();
    await compileTypeScript({
        inputPath: vendureConfigPath,
        outputPath,
        logger,
        transformTsConfigPathMappings,
    });
    logger.info(`TypeScript compilation completed in ${Date.now() - compileStart}ms`);

    // 2. Discover plugins
    const findPluginsStart = Date.now();
    const pluginFiles = await findVendurePluginFiles({
        tempDir: outputPath,
        vendureConfigPath,
    });
    logger.info(`Found ${pluginFiles.length} potential plugin files in ${Date.now() - findPluginsStart}ms`);

    const analyzePluginsStart = Date.now();
    const plugins = await discoverPlugins(pluginFiles);
    logger.info(
        `Analyzed plugins and found ${plugins.length} dashboard extensions in ${Date.now() - analyzePluginsStart}ms`,
    );

    // 3. Load the compiled config
    const loadConfigStart = Date.now();
    const configFileName = path.basename(vendureConfigPath);
    const compiledConfigFilePath = pathToFileURL(
        getCompiledConfigPath({
            inputRootDir: path.dirname(vendureConfigPath),
            outputPath,
            configFileName,
        }),
    ).href.replace(/.ts$/, '.js');

    // Create package.json with type commonjs
    await fs.writeFile(path.join(outputPath, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2));

    // Find the exported config symbol
    const sourceFile = ts.createSourceFile(
        vendureConfigPath,
        await fs.readFile(vendureConfigPath, 'utf-8'),
        ts.ScriptTarget.Latest,
        true,
    );
    const exportedSymbolName = findConfigExport(sourceFile);
    if (!exportedSymbolName) {
        throw new Error(
            `Could not find a variable exported as VendureConfig. Please specify the name of the exported variable.`,
        );
    }

    // Register path aliases from tsconfig
    const tsConfigInfo = await findTsConfigPaths(
        vendureConfigPath,
        logger,
        'loading',
        transformTsConfigPathMappings,
    );
    if (tsConfigInfo) {
        tsConfigPaths.register({
            baseUrl: outputPath,
            paths: tsConfigInfo.paths,
        });
    }

    const config = await import(compiledConfigFilePath).then(m => m[exportedSymbolName]);
    if (!config) {
        throw new Error(
            `Could not find a variable exported as VendureConfig with the name "${exportedSymbolName}".`,
        );
    }
    logger.info(`Config loaded in ${Date.now() - loadConfigStart}ms`);

    const totalTime = Date.now() - startTime;
    logger.info(`Total compilation process completed in ${totalTime}ms`);

    return { vendureConfig: config, exportedSymbolName, pluginInfo: plugins };
}

interface FindPluginFilesOptions {
    tempDir: string;
    vendureConfigPath: string;
}

async function findVendurePluginFiles({
    tempDir,
    vendureConfigPath,
}: FindPluginFilesOptions): Promise<string[]> {
    // Find the actual node_modules directory by resolving @vendure/core
    let nodeModulesRoot: string;
    try {
        const coreUrl = await import.meta.resolve('@vendure/core');
        console.log(`Found core URL: ${coreUrl}`);
        // Convert URL to path, strip 'file://' prefix
        const corePath = fileURLToPath(coreUrl);
        console.log(`Found core path: ${corePath}`);
        // corePath will be something like "...node_modules/@vendure/core/dist/index.js"
        // We need to go up 3 levels to get to the root node_modules
        nodeModulesRoot = path.join(path.dirname(corePath), '..', '..', '..');
    } catch (e) {
        console.log(`Failed to resolve @vendure/core: ${e}`);
        // Fallback to using vendureConfigPath if resolve fails
        nodeModulesRoot = path.dirname(vendureConfigPath);
    }

    const patterns = [
        // Look for all JS files in the temp dir (for local compiled plugins)
        path.join(tempDir, '**/*.js'),
        // Look for JS files in node_modules, but skip nested node_modules
        path.join(nodeModulesRoot, 'node_modules/*/dist/**/*.js'),
        path.join(nodeModulesRoot, 'node_modules/@*/**/dist/**/*.js'),
        // Also check root-level files in node_modules in case not compiled to dist
        path.join(nodeModulesRoot, 'node_modules/*/*.js'),
        path.join(nodeModulesRoot, 'node_modules/@*/*/*.js'),
    ];

    const files = await glob(patterns, {
        ignore: [
            '**/node_modules/**/node_modules/**',
            '**/*.spec.js',
            '**/*.test.js',
            '**/tests/**',
            '**/testing/**',
            '**/coverage/**',
            '**/docs/**',
        ],
    });

    console.log(`Found ${files.length} files to scan for plugins`);
    console.log(`Node modules root: ${nodeModulesRoot}`);
    console.log(`Temp dir: ${tempDir}`);
    console.log(`Looking in patterns:`, patterns);

    const potentialPluginFiles: string[] = [];

    for (const file of files) {
        try {
            const content = await fs.readFile(file, 'utf-8');
            if (content.includes('@vendure/core')) {
                potentialPluginFiles.push(file);
            }
        } catch (e: any) {
            // Skip files we can't read
        }
    }

    return potentialPluginFiles;
}

interface DiscoverPluginsOptions {
    compiledConfigDir: string;
    vendureConfigPath: string;
    logger: Logger;
}

async function discoverPlugins(filePaths: string[]): Promise<PluginInfo[]> {
    const plugins: PluginInfo[] = [];

    for (const filePath of filePaths) {
        const content = await fs.readFile(filePath, 'utf-8');

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
                console.log(`Found plugin "${pluginName}" in file:`, filePath);
                console.log(`Raw dashboard path from decorator:`, dashboardPath);
                // Keep the dashboard path relative to the plugin file
                const resolvedDashboardPath = dashboardPath.startsWith('.')
                    ? dashboardPath // Keep the relative path as-is
                    : './' + path.relative(path.dirname(filePath), dashboardPath); // Make absolute path relative
                console.log(`Plugin base dir:`, path.dirname(filePath));
                console.log(`Resolved dashboard path:`, resolvedDashboardPath);
                const absolutePath = path.resolve(path.dirname(filePath), resolvedDashboardPath);
                console.log(`Absolute path for existence check:`, absolutePath);
                console.log(`Does dashboard file exist?`, fs.existsSync(absolutePath));
                plugins.push({
                    name: pluginName,
                    pluginPath: filePath,
                    dashboardEntryPath: resolvedDashboardPath, // Use the relative path
                });
            }
        } catch (e) {
            console.error(`Failed to parse ${filePath}:`, e);
        }
    }

    return plugins;
}

/**
 * Compiles TypeScript files to JavaScript
 */
async function compileTypeScript({
    inputPath,
    outputPath,
    logger,
    transformTsConfigPathMappings,
}: {
    inputPath: string;
    outputPath: string;
    logger: Logger;
    transformTsConfigPathMappings: Required<PathAdapter>['transformTsConfigPathMappings'];
}): Promise<void> {
    await fs.ensureDir(outputPath);
    const program = ts.createProgram([inputPath], {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        outDir: outputPath,
        allowJs: true,
        resolveJsonModule: true,
    });

    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    for (const diagnostic of allDiagnostics) {
        if (diagnostic.file) {
            const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            logger.warn(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            logger.warn(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    }
}

/**
 * Finds and parses tsconfig files in the given directory and its parent directories.
 */
async function findTsConfigPaths(
    configPath: string,
    logger: Logger,
    phase: 'compiling' | 'loading',
    transformTsConfigPathMappings: Required<PathAdapter>['transformTsConfigPathMappings'],
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
                } catch (e: any) {
                    logger.warn(`Could not read or parse tsconfig file ${tsConfigPath}: ${e.message}`);
                }
            }
        } catch (e: any) {
            logger.warn(`Could not read directory ${currentDir}: ${e.message}`);
        }
        currentDir = path.dirname(currentDir);
    }
    return undefined;
}
