import { VendureConfig } from '@vendure/core';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { open } from 'fs/promises';
import path from 'path';
import tsConfigPaths from 'tsconfig-paths';
import { RegisterParams } from 'tsconfig-paths/lib/register.js';
import * as ts from 'typescript';
import { fileURLToPath, pathToFileURL } from 'url';

import { Logger, PathAdapter, PluginInfo } from '../types.js';

import { findConfigExport } from './ast-utils.js';
import { debugLogger } from './debug-logger.js';
import { discoverPlugins } from './plugin-discovery.js';
import { findTsConfigPaths } from './tsconfig-utils.js';

const defaultPathAdapter: Required<PathAdapter> = {
    getCompiledConfigPath: ({ outputPath, configFileName }) => path.join(outputPath, configFileName),
    transformTsConfigPathMappings: ({ patterns }) => patterns,
};

export interface PackageScannerConfig {
    nodeModulesRoot?: string;
    /**
     * An array of glob patterns that will be appended to "node_modules/" to scan for plugins.
     * For example: ['vendure-*plugin*', '@vendure/*plugin*']
     * If not specified, will scan all files in node_modules that appear in imports
     * from your project.
     */
    globPatterns?: string[];
}

export interface CompilerOptions {
    vendureConfigPath: string;
    outputPath: string;
    pathAdapter?: PathAdapter;
    logger?: Logger;
    pluginPackageScanner?: PackageScannerConfig;
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
        logger = debugLogger,
        pluginPackageScanner,
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
        packageScanner: pluginPackageScanner,
    });

    const analyzePluginsStart = Date.now();

    logger.debug(`pluginFiles: ${JSON.stringify(pluginFiles)}`);
    const plugins = await discoverPlugins(
        vendureConfigPath,
        transformTsConfigPathMappings,
        pluginFiles,
        logger,
    );
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
    await fs.writeFile(
        path.join(outputPath, 'package.json'),
        JSON.stringify({ type: 'commonjs', private: true }, null, 2),
    );

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

    await registerTsConfigPaths({
        outputPath,
        configPath: vendureConfigPath,
        logger,
        phase: 'loading',
        transformTsConfigPathMappings,
    });

    let config: any;
    try {
        config = await import(compiledConfigFilePath).then(m => m[exportedSymbolName]);
    } catch (e) {
        logger.error(`Error loading config: ${e instanceof Error ? e.message : String(e)}`);
    }
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
    packageScanner,
}: FindPluginFilesOptions & {
    logger: Logger;
    packageScanner?: PackageScannerConfig;
}): Promise<string[]> {
    let nodeModulesRoot = packageScanner?.nodeModulesRoot;
    const readStart = Date.now();
    if (!nodeModulesRoot) {
        // If the node_modules root path has not been explicitly
        // specified, we will try to guess it by resolving the
        // `@vendure/core` package.
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
    }

    const pluginGlobPatterns = packageScanner?.globPatterns;

    const patterns = [
        // Local compiled plugins in temp dir
        path.join(tempDir, '**/*.js'),
        // Node modules patterns
        ...(pluginGlobPatterns
            ? pluginGlobPatterns.map(pattern =>
                  path.join(nodeModulesRoot, 'node_modules', pattern, '**/*.js'),
              )
            : [path.join(nodeModulesRoot, 'node_modules/**/*.js')]),
    ];

    logger.debug(`Finding Vendure plugins using patterns: ${patterns.join('\n')}`);

    const globStart = Date.now();
    const files = await glob(patterns, {
        ignore: [
            // Standard test & doc files
            '**/node_modules/**/node_modules/**',
            '**/*.spec.js',
            '**/*.test.js',
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

    // Find tsconfig paths first
    const tsConfigInfo = await findTsConfigPaths(
        inputPath,
        logger,
        'compiling',
        transformTsConfigPathMappings,
    );

    const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.Node10, // More explicit CJS resolution
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: false,
        // Speed optimizations
        noEmitOnError: false, // Emit output even if there are errors
        noImplicitAny: false, // Don't require implicit any
        noUnusedLocals: false, // Don't check for unused locals
        noUnusedParameters: false, // Don't check for unused parameters
        allowJs: true,
        checkJs: false, // Don't type check JS files
        skipDefaultLibCheck: true, // Skip checking .d.ts files
        isolatedModules: false, // Need to check cross-file references to compile dependencies
        incremental: false, // Don't use incremental compilation (faster for one-off builds)
        resolveJsonModule: true,
        preserveSymlinks: false,
        outDir: outputPath,
    };

    logger.debug(`Compiling ${inputPath} to ${outputPath} using TypeScript...`);

    // Add path mappings if found
    if (tsConfigInfo) {
        // We need to set baseUrl and paths for TypeScript to resolve the imports
        compilerOptions.baseUrl = tsConfigInfo.baseUrl;
        compilerOptions.paths = tsConfigInfo.paths;
        // This is critical - it tells TypeScript to preserve the paths in the output
        // compilerOptions.rootDir = tsConfigInfo.baseUrl;
    }

    logger.debug(`tsConfig paths: ${JSON.stringify(tsConfigInfo?.paths, null, 2)}`);
    logger.debug(`tsConfig baseUrl: ${tsConfigInfo?.baseUrl ?? 'UNKNOWN'}`);

    // Create a custom transformer to rewrite the output paths
    const customTransformers: ts.CustomTransformers = {
        after: [
            context => {
                return sourceFile => {
                    // Only transform files that are not the entry point
                    if (sourceFile.fileName === inputPath) {
                        return sourceFile;
                    }
                    // Rewrite the file path to be relative to the config file
                    const relativePath = path.relative(path.dirname(inputPath), sourceFile.fileName);
                    const newPath = path.join(outputPath, path.basename(sourceFile.fileName));
                    sourceFile.fileName = newPath;
                    return sourceFile;
                };
            },
        ],
    };

    const program = ts.createProgram([inputPath], compilerOptions);
    const emitResult = program.emit(undefined, undefined, undefined, undefined, customTransformers);

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

async function registerTsConfigPaths(options: {
    outputPath: string;
    configPath: string;
    logger: Logger;
    phase: 'compiling' | 'loading';
    transformTsConfigPathMappings: Required<PathAdapter>['transformTsConfigPathMappings'];
}) {
    const { outputPath, configPath, logger, phase, transformTsConfigPathMappings } = options;
    const tsConfigInfo = await findTsConfigPaths(configPath, logger, phase, transformTsConfigPathMappings);
    if (tsConfigInfo) {
        const params: RegisterParams = {
            baseUrl: outputPath,
            paths: tsConfigInfo.paths,
        };
        logger.debug(`Registering tsconfig paths: ${JSON.stringify(params, null, 2)}`);
        tsConfigPaths.register(params);
    }
}
