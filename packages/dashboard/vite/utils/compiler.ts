import { VendureConfig } from '@vendure/core';
import { parse } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { open } from 'fs/promises';
import path from 'path';
import tsConfigPaths from 'tsconfig-paths';
import * as ts from 'typescript';
import { fileURLToPath, pathToFileURL } from 'url';

import { findConfigExport } from './ast-utils.js';

type Logger = {
    info: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
    error: (message: string) => void;
};

export type PluginInfo = {
    name: string;
    pluginPath: string;
    dashboardEntryPath: string | undefined;
};

const defaultLogger: Logger = {
    info: (message: string) => {
        // eslint-disable-next-line no-console
        console.log(message);
    },
    warn: (message: string) => {
        // eslint-disable-next-line no-console
        console.warn(message);
    },
    debug: (message: string) => {
        // eslint-disable-next-line no-console
        console.debug(message);
    },
    error: (message: string) => {
        // eslint-disable-next-line no-console
        console.error(message);
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
    /**
     * An array of glob patterns that will be appended to "node_modules/" to scan for plugins.
     * For example: ['vendure-*plugin*', '@vendure/*plugin*']
     * If not specified, will scan all files in node_modules (slower).
     */
    pluginScanPatterns?: string[];
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
    const {
        vendureConfigPath,
        outputPath,
        pathAdapter,
        logger = defaultLogger,
        pluginScanPatterns,
    } = options;
    const getCompiledConfigPath =
        pathAdapter?.getCompiledConfigPath ?? defaultPathAdapter.getCompiledConfigPath;
    const transformTsConfigPathMappings =
        pathAdapter?.transformTsConfigPathMappings ?? defaultPathAdapter.transformTsConfigPathMappings;

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
    const pluginFiles = await findVendurePluginFiles({
        tempDir: outputPath,
        vendureConfigPath,
        logger,
        pluginScanPatterns,
    });

    const analyzePluginsStart = Date.now();
    const plugins = await discoverPlugins(pluginFiles, logger);
    logger.info(
        `Analyzed plugins and found ${plugins.length} dashboard extensions in ${Date.now() - analyzePluginsStart}ms`,
    );

    // 3. Load the compiled config
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

    const loadConfigStart = Date.now();
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
    logger.info(`Loaded config in ${Date.now() - loadConfigStart}ms`);

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
    logger,
    pluginScanPatterns,
}: FindPluginFilesOptions & {
    logger: Logger;
    pluginScanPatterns?: string[];
}): Promise<string[]> {
    let nodeModulesRoot: string;
    const readStart = Date.now();
    try {
        const coreUrl = import.meta.resolve('@vendure/core');
        logger.debug(`Found core URL: ${coreUrl}`);
        const corePath = fileURLToPath(coreUrl);
        logger.debug(`Found core path: ${corePath}`);
        nodeModulesRoot = path.join(path.dirname(corePath), '..', '..', '..');
    } catch (e) {
        logger.warn(`Failed to resolve @vendure/core: ${e instanceof Error ? e.message : String(e)}`);
        nodeModulesRoot = path.dirname(vendureConfigPath);
    }

    const patterns = [
        // Local compiled plugins in temp dir
        path.join(tempDir, '**/*.js'),
        // Node modules patterns
        ...(pluginScanPatterns
            ? pluginScanPatterns.map(pattern =>
                  path.join(nodeModulesRoot, 'node_modules', pattern, '**/*.js'),
              )
            : [path.join(nodeModulesRoot, 'node_modules/**/*.js')]),
    ];

    logger.info(`Using patterns: ${patterns.join('\n')}`);

    const globStart = Date.now();
    const files = await glob(patterns, {
        ignore: [
            // Standard test & doc files
            '**/node_modules/**/node_modules/**',
            '**/*.spec.js',
            '**/*.test.js',
            '**/tests/**',
            '**/testing/**',
            '**/coverage/**',
            '**/docs/**',
        ],
        onlyFiles: true,
        absolute: true,
        followSymbolicLinks: false,
        stats: false,
    });
    logger.debug(`Glob found ${files.length} files in ${Date.now() - globStart}ms`);
    logger.debug(`Using patterns: ${patterns.join('\n')}`);

    // Read files in larger parallel batches
    const batchSize = 100; // Increased batch size
    const potentialPluginFiles: string[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async file => {
                try {
                    // Try reading just first 3000 bytes first - most imports are at the top
                    const fileHandle = await open(file, 'r');
                    try {
                        const buffer = Buffer.alloc(3000);
                        const { bytesRead } = await fileHandle.read(buffer, 0, 3000, 0);
                        let content = buffer.toString('utf8', 0, bytesRead);

                        // Quick check for common indicators
                        if (content.includes('@vendure/core')) {
                            return file;
                        }

                        // If we find a promising indicator but no definitive match,
                        // read more of the file
                        if (content.includes('@vendure') || content.includes('VendurePlugin')) {
                            const largerBuffer = Buffer.alloc(5000);
                            const { bytesRead: moreBytes } = await fileHandle.read(largerBuffer, 0, 5000, 0);
                            content = largerBuffer.toString('utf8', 0, moreBytes);
                            if (content.includes('@vendure/core')) {
                                return file;
                            }
                        }
                    } finally {
                        await fileHandle.close();
                    }
                } catch (e: any) {
                    logger.warn(`Failed to read file ${file}: ${e instanceof Error ? e.message : String(e)}`);
                }
                return null;
            }),
        );

        const validResults = results.filter((f): f is string => f !== null);
        potentialPluginFiles.push(...validResults);
    }

    logger.info(
        `Found ${potentialPluginFiles.length} potential plugin files in ${Date.now() - readStart}ms ` +
            `(scanned ${files.length} files)`,
    );

    return potentialPluginFiles;
}

interface DiscoverPluginsOptions {
    compiledConfigDir: string;
    vendureConfigPath: string;
    logger: Logger;
}

async function discoverPlugins(filePaths: string[], logger: Logger): Promise<PluginInfo[]> {
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
                logger.debug(`Found plugin "${pluginName}" in file: ${filePath}`);
                logger.debug(`Raw dashboard path from decorator: ${dashboardPath}`);
                // Keep the dashboard path relative to the plugin file
                const resolvedDashboardPath = dashboardPath.startsWith('.')
                    ? dashboardPath // Keep the relative path as-is
                    : './' + path.relative(path.dirname(filePath), dashboardPath); // Make absolute path relative
                logger.debug(`Plugin base dir: ${path.dirname(filePath)}`);
                logger.debug(`Resolved dashboard path: ${resolvedDashboardPath}`);
                const absolutePath = path.resolve(path.dirname(filePath), resolvedDashboardPath);
                logger.debug(`Absolute path for existence check: ${absolutePath}`);
                logger.debug(`Does dashboard file exist? ${fs.existsSync(absolutePath) ? 'true' : 'false'}`);
                plugins.push({
                    name: pluginName,
                    pluginPath: filePath,
                    dashboardEntryPath: resolvedDashboardPath, // Use the relative path
                });
            }
        } catch (e) {
            logger.error(`Failed to parse ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
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
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: false,
        // Speed optimizations - disable all type checking
        noResolve: true, // Don't add referenced modules to the program
        noEmitOnError: false, // Emit output even if there are errors
        noImplicitAny: false, // Don't require implicit any
        noUnusedLocals: false, // Don't check for unused locals
        noUnusedParameters: false, // Don't check for unused parameters
        allowJs: true,
        checkJs: false, // Don't type check JS files
        skipDefaultLibCheck: true, // Skip checking .d.ts files
        isolatedModules: true, // Speed up compilation by not checking cross-file references
        incremental: false, // Don't use incremental compilation (faster for one-off builds)
        resolveJsonModule: true,
        outDir: outputPath,
    });

    // Skip type checking entirely
    const emitResult = program.emit(undefined, undefined, undefined, undefined, {
        // Only transform the code, skip type checking
        before: [],
        after: [],
        afterDeclarations: [],
    });

    // Only log actual emit errors, not type errors
    if (emitResult.emitSkipped) {
        for (const diagnostic of emitResult.diagnostics) {
            if (diagnostic.file && diagnostic.start !== undefined) {
                const { line, character } = ts.getLineAndCharacterOfPosition(
                    diagnostic.file,
                    diagnostic.start,
                );
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                logger.warn(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            } else {
                logger.warn(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
            }
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
