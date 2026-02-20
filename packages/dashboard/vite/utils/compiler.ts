import { VendureConfig } from '@vendure/core';
import fs from 'fs-extra';
import path from 'path';
import tsConfigPaths from 'tsconfig-paths';
import { RegisterParams } from 'tsconfig-paths/lib/register.js';
import * as ts from 'typescript';
import { pathToFileURL } from 'url';

import { Logger, PathAdapter, PluginInfo } from '../types.js';

import { findConfigExport } from './ast-utils.js';
import { noopLogger } from './logger.js';
import { createPathTransformer } from './path-transformer.js';
import { discoverPlugins } from './plugin-discovery.js';
import { findTsConfigPaths } from './tsconfig-utils.js';

const defaultPathAdapter: Required<PathAdapter> = {
    getCompiledConfigPath: ({ outputPath, configFileName }) => path.join(outputPath, configFileName),
    transformTsConfigPathMappings: ({ patterns }) => patterns,
};

export interface PackageScannerConfig {
    nodeModulesRoot?: string;
}

export interface CompilerOptions {
    vendureConfigPath: string;
    outputPath: string;
    pathAdapter?: PathAdapter;
    logger?: Logger;
    pluginPackageScanner?: PackageScannerConfig;
    module?: 'commonjs' | 'esm';
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
    const { vendureConfigPath, outputPath, pathAdapter, logger = noopLogger, pluginPackageScanner } = options;
    const getCompiledConfigPath =
        pathAdapter?.getCompiledConfigPath ?? defaultPathAdapter.getCompiledConfigPath;
    const transformTsConfigPathMappings =
        pathAdapter?.transformTsConfigPathMappings ?? defaultPathAdapter.transformTsConfigPathMappings;

    // 0. Clear the outputPath
    fs.removeSync(outputPath);

    // 1. Compile TypeScript files
    const compileStart = Date.now();
    await compileTypeScript({
        inputPath: vendureConfigPath,
        outputPath,
        logger,
        transformTsConfigPathMappings,
        module: options.module ?? 'commonjs',
    });
    logger.info(`TypeScript compilation completed in ${Date.now() - compileStart}ms`);

    // 2. Discover plugins
    const analyzePluginsStart = Date.now();
    const plugins = await discoverPlugins({
        vendureConfigPath,
        transformTsConfigPathMappings,
        logger,
        outputPath,
        pluginPackageScanner,
    });
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
        JSON.stringify({ type: options.module === 'esm' ? 'module' : 'commonjs', private: true }, null, 2),
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
    } catch (e: any) {
        const errorMessage =
            e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : JSON.stringify(e, null, 2);
        logger.error(`Error loading config: ${errorMessage}`);
    }
    if (!config) {
        throw new Error(
            `Could not find a variable exported as VendureConfig with the name "${exportedSymbolName}".`,
        );
    }
    logger.debug(`Loaded config in ${Date.now() - loadConfigStart}ms`);

    return { vendureConfig: config, exportedSymbolName, pluginInfo: plugins };
}

/**
 * Compiles TypeScript files to JavaScript
 */
async function compileTypeScript({
    inputPath,
    outputPath,
    logger,
    transformTsConfigPathMappings,
    module,
}: {
    inputPath: string;
    outputPath: string;
    logger: Logger;
    transformTsConfigPathMappings: Required<PathAdapter>['transformTsConfigPathMappings'];
    module: 'commonjs' | 'esm';
}): Promise<void> {
    await fs.ensureDir(outputPath);

    // Find tsconfig paths - we need BOTH original and transformed versions
    // Original paths: Used by TypeScript for module resolution during compilation
    // Transformed paths: Used by the path transformer for rewriting output imports
    const originalTsConfigInfo = await findTsConfigPaths(
        inputPath,
        logger,
        'compiling',
        ({ patterns }) => patterns, // No transformation - use original paths
    );
    const transformedTsConfigInfo = await findTsConfigPaths(
        inputPath,
        logger,
        'compiling',
        transformTsConfigPathMappings, // Apply user's transformation
    );

    const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2020,
        module: module === 'esm' ? ts.ModuleKind.ESNext : ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.Node10, // More explicit CJS resolution
        jsx: ts.JsxEmit.ReactJSX, // Emit React JSX optimized for production
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

    // Add path mappings if found - use ORIGINAL paths for TypeScript module resolution
    if (originalTsConfigInfo) {
        // We need to set baseUrl and paths for TypeScript to resolve the imports
        compilerOptions.baseUrl = originalTsConfigInfo.baseUrl;
        compilerOptions.paths = originalTsConfigInfo.paths;
        // This is critical - it tells TypeScript to preserve the paths in the output
        // compilerOptions.rootDir = originalTsConfigInfo.baseUrl;
    }

    logger.debug(`tsConfig original paths: ${JSON.stringify(originalTsConfigInfo?.paths, null, 2)}`);
    logger.debug(`tsConfig transformed paths: ${JSON.stringify(transformedTsConfigInfo?.paths, null, 2)}`);
    logger.debug(`tsConfig baseUrl: ${originalTsConfigInfo?.baseUrl ?? 'UNKNOWN'}`);

    // Build custom transformers
    const afterTransformers: Array<ts.TransformerFactory<ts.SourceFile>> = [];

    // Add path transformer for ESM mode when there are path mappings
    // This is necessary because tsconfig-paths.register() only works for CommonJS require(),
    // not for ESM import(). We need to transform the import paths during compilation.
    //
    // IMPORTANT: We use 'after' transformers because:
    // 1. 'before' runs before TypeScript resolves modules - changing paths there breaks resolution
    // 2. 'after' runs after module resolution but before emit - paths are transformed in output only
    //
    // We use ORIGINAL (untransformed) paths here because the transformer resolves aliases
    // relative to the source file's directory using path.relative(). Since TypeScript preserves
    // directory nesting in output, the relative relationships between source files are the same
    // in both the source and output trees.
    if (module === 'esm' && originalTsConfigInfo) {
        logger.debug('Adding path transformer for ESM mode');
        afterTransformers.push(
            createPathTransformer({
                baseUrl: originalTsConfigInfo.baseUrl,
                paths: originalTsConfigInfo.paths,
            }),
        );
    }

    // Add the existing transformer for non-entry-point files
    afterTransformers.push(context => {
        return sourceFile => {
            // Only transform files that are not the entry point
            if (sourceFile.fileName === inputPath) {
                return sourceFile;
            }
            sourceFile.fileName = path.join(outputPath, path.basename(sourceFile.fileName));
            return sourceFile;
        };
    });

    const customTransformers: ts.CustomTransformers = {
        after: afterTransformers,
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
