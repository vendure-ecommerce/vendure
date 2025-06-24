import { VendureConfig } from '@vendure/core';
import fs from 'fs-extra';
import path from 'path';
import tsConfigPaths from 'tsconfig-paths';
import * as ts from 'typescript';
import { pathToFileURL } from 'url';

import { findConfigExport, getPluginInfo } from './ast-utils.js';

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
        /* noop */
    },
    warn: (message: string) => {
        /* noop */
    },
    debug: (message: string) => {
        /* noop */
    },
};

/**
 * @description
 * The PathAdapter interface allows customization of how paths are handled
 * when compiling the Vendure config and its imports.
 *
 * This is particularly useful in complex project structures, such as monorepos,
 * where the Vendure config file may not be in the root directory,
 * or when you need to transform TypeScript path mappings.
 */
export interface PathAdapter {
    /**
     * @description
     * A function to determine the path to the compiled Vendure config file. The default implementation
     * simple joins the output directory with the config file name:
     *
     * ```ts
     * return path.join(outputPath, configFileName)
     * ```
     *
     * However, in some cases with more complex project structures, you may need to
     * provide a custom implementation to ensure the compiled config file is
     * correctly located.
     *
     * @example
     * ```ts
     * getCompiledConfigPath: ({ inputRootDir, outputPath, configFileName }) => {
     *     const projectName = inputRootDir.split('/libs/')[1].split('/')[0];
     *     const pathAfterProject = inputRootDir.split(`/libs/${projectName}`)[1];
     *     const compiledConfigFilePath = `${outputPath}/${projectName}${pathAfterProject}`;
     *     return path.join(compiledConfigFilePath, configFileName);
     * },
     * ```
     */
    getCompiledConfigPath?: (params: {
        inputRootDir: string;
        outputPath: string;
        configFileName: string;
    }) => string;
    /**
     * If your project makes use of the TypeScript `paths` configuration, the compiler will
     * attempt to use these paths when compiling the Vendure config and its imports.
     *
     * In certain cases, you may need to transform these paths before they are used. For instance,
     * if your project is a monorepo and the paths are defined relative to the root of the monorepo,
     * you may need to adjust them to be relative to the output directory where the compiled files are located.
     *
     * @example
     * ```ts
     * transformTsConfigPathMappings: ({ phase, patterns }) => {
     *     // "loading" phase is when the compiled Vendure code is being loaded by
     *     // the plugin, in order to introspect the configuration of your app.
     *     if (phase === 'loading') {
     *         return patterns.map((p) =>
     *             p.replace('libs/', '').replace(/.ts$/, '.js'),
     *         );
     *     }
     *     return patterns;
     * },
     * ```
     * @param params
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

export interface ConfigLoaderOptions {
    vendureConfigPath: string;
    tempDir: string;
    pathAdapter?: PathAdapter;
    vendureConfigExport?: string;
    logger?: Logger;
    reportCompilationErrors?: boolean;
}

export interface LoadVendureConfigResult {
    vendureConfig: VendureConfig;
    exportedSymbolName: string;
    pluginInfo: PluginInfo[];
}

/**
 * @description
 * This function compiles the given Vendure config file and any imported relative files (i.e.
 * project files, not npm packages) into a temporary directory, and returns the compiled config.
 *
 * The reason we need to do this is that Vendure code makes use of TypeScript experimental decorators
 * (e.g. for NestJS decorators and TypeORM column decorators) which are not supported by esbuild.
 *
 * In Vite, when we load some TypeScript into the top-level Vite config file (in the end-user project), Vite
 * internally uses esbuild to temporarily compile that TypeScript code. Unfortunately, esbuild does not support
 * these experimental decorators, errors will be thrown as soon as e.g. a TypeORM column decorator is encountered.
 *
 * To work around this, we compile the Vendure config file and all its imports using the TypeScript compiler,
 * which fully supports these experimental decorators. The compiled files are then loaded by Vite, which is able
 * to handle the compiled JavaScript output.
 */
export async function loadVendureConfig(options: ConfigLoaderOptions): Promise<LoadVendureConfigResult> {
    const { vendureConfigPath, vendureConfigExport, tempDir, pathAdapter } = options;
    const getCompiledConfigPath =
        pathAdapter?.getCompiledConfigPath ?? defaultPathAdapter.getCompiledConfigPath;
    const transformTsConfigPathMappings =
        pathAdapter?.transformTsConfigPathMappings ?? defaultPathAdapter.transformTsConfigPathMappings;
    const logger = options.logger || defaultLogger;
    const outputPath = tempDir;
    const configFileName = path.basename(vendureConfigPath);
    const inputRootDir = path.dirname(vendureConfigPath);
    await fs.remove(outputPath);
    const pluginInfo = await compileFile({
        inputRootDir,
        inputPath: vendureConfigPath,
        outputDir: outputPath,
        logger,
        transformTsConfigPathMappings,
    });
    const compiledConfigFilePath = pathToFileURL(
        getCompiledConfigPath({
            inputRootDir,
            outputPath,
            configFileName,
        }),
    ).href.replace(/.ts$/, '.js');
    // create package.json with type commonjs and save it to the output dir
    await fs.writeFile(path.join(outputPath, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2));

    // We need to figure out the symbol exported by the config file by
    // analyzing the AST and finding an export with the type "VendureConfig"
    const sourceFile = ts.createSourceFile(
        vendureConfigPath,
        await fs.readFile(vendureConfigPath, 'utf-8'),
        ts.ScriptTarget.Latest,
        true,
    );
    const detectedExportedSymbolName = findConfigExport(sourceFile);
    const configExportedSymbolName = detectedExportedSymbolName || vendureConfigExport;
    if (!configExportedSymbolName) {
        throw new Error(
            `Could not find a variable exported as VendureConfig. Please specify the name of the exported variable using the "vendureConfigExport" option.`,
        );
    }

    // Register path aliases from tsconfig before importing
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

    const config = await import(compiledConfigFilePath).then(m => m[configExportedSymbolName]);
    if (!config) {
        throw new Error(
            `Could not find a variable exported as VendureConfig with the name "${configExportedSymbolName}".`,
        );
    }
    return { vendureConfig: config, exportedSymbolName: configExportedSymbolName, pluginInfo };
}

/**
 * Finds and parses tsconfig files in the given directory and its parent directories.
 * Returns the paths configuration if found.
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
                    // Use JSON5 or similar parser if comments are expected in tsconfig.json
                    // For simplicity, assuming standard JSON here. Handle parse errors.
                    const tsConfig = JSON.parse(tsConfigContent);
                    const compilerOptions = tsConfig.compilerOptions || {};

                    if (compilerOptions.paths) {
                        // Determine the effective baseUrl: explicitly set or the directory of tsconfig.json
                        const tsConfigBaseUrl = path.resolve(currentDir, compilerOptions.baseUrl || '.');
                        const paths: Record<string, string[]> = {};

                        for (const [alias, patterns] of Object.entries(compilerOptions.paths)) {
                            // Store paths as defined in tsconfig, they will be relative to baseUrl
                            const normalizedPatterns = (patterns as string[]).map(pattern =>
                                // Normalize slashes for consistency, keep relative
                                pattern.replace(/\\/g, '/'),
                            );
                            paths[alias] = transformTsConfigPathMappings({
                                phase,
                                alias,
                                patterns: normalizedPatterns,
                            });
                        }
                        logger.debug(
                            `Found tsconfig paths in ${tsConfigPath}: ${JSON.stringify(
                                {
                                    baseUrl: tsConfigBaseUrl,
                                    paths,
                                },
                                null,
                                2,
                            )}`,
                        );
                        return { baseUrl: tsConfigBaseUrl, paths };
                    }
                } catch (e: any) {
                    logger.warn(
                        `Could not read or parse tsconfig file ${tsConfigPath}: ${e.message as string}`,
                    );
                }
            }
        } catch (e: any) {
            // If we can't read the directory, just continue to the parent
            logger.warn(`Could not read directory ${currentDir}: ${e.message as string}`);
        }
        currentDir = path.dirname(currentDir);
    }
    logger.debug(`No tsconfig paths found traversing up from ${configDir}`);
    return undefined;
}

type CompileFileOptions = {
    inputRootDir: string;
    inputPath: string;
    outputDir: string;
    transformTsConfigPathMappings: Required<PathAdapter>['transformTsConfigPathMappings'];
    logger?: Logger;
    compiledFiles?: Set<string>;
    isRoot?: boolean;
    pluginInfo?: PluginInfo[];
    reportCompilationErrors?: boolean;
};

export async function compileFile({
    inputRootDir,
    inputPath,
    outputDir,
    transformTsConfigPathMappings,
    logger = defaultLogger,
    compiledFiles = new Set<string>(),
    isRoot = true,
    pluginInfo = [],
    reportCompilationErrors = false,
}: CompileFileOptions): Promise<PluginInfo[]> {
    const absoluteInputPath = path.resolve(inputPath);
    if (compiledFiles.has(absoluteInputPath)) {
        return pluginInfo;
    }
    compiledFiles.add(absoluteInputPath);

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Read the source file
    const source = await fs.readFile(inputPath, 'utf-8');

    // Parse the source to find relative imports
    const sourceFile = ts.createSourceFile(absoluteInputPath, source, ts.ScriptTarget.Latest, true);

    const importPaths = new Set<string>();
    let tsConfigInfo: { baseUrl: string; paths: Record<string, string[]> } | undefined;

    if (isRoot) {
        tsConfigInfo = await findTsConfigPaths(
            absoluteInputPath,
            logger,
            'compiling',
            transformTsConfigPathMappings,
        );
        if (tsConfigInfo) {
            logger?.debug(`Using TypeScript configuration: ${JSON.stringify(tsConfigInfo, null, 2)}`);
        }
    }

    async function collectImports(node: ts.Node) {
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
            const importPath = node.moduleSpecifier.text;

            // Handle relative imports
            if (importPath.startsWith('.')) {
                const resolvedPath = path.resolve(path.dirname(absoluteInputPath), importPath);
                let resolvedTsPath = resolvedPath + '.ts';
                // Also check for .tsx if .ts doesn't exist
                if (!(await fs.pathExists(resolvedTsPath))) {
                    const resolvedTsxPath = resolvedPath + '.tsx';
                    if (await fs.pathExists(resolvedTsxPath)) {
                        resolvedTsPath = resolvedTsxPath;
                    } else {
                        // If neither exists, maybe it's an index file?
                        const resolvedIndexPath = path.join(resolvedPath, 'index.ts');
                        if (await fs.pathExists(resolvedIndexPath)) {
                            resolvedTsPath = resolvedIndexPath;
                        } else {
                            const resolvedIndexTsxPath = path.join(resolvedPath, 'index.tsx');
                            if (await fs.pathExists(resolvedIndexTsxPath)) {
                                resolvedTsPath = resolvedIndexTsxPath;
                            } else {
                                // If still not found, log a warning or let TS handle it later
                                logger?.warn(
                                    `Could not resolve relative import "${importPath}" from "${absoluteInputPath}" to an existing .ts/.tsx file.`,
                                );
                                // Do not add to importPaths if we can't verify existence
                                return;
                            }
                        }
                    }
                }
                importPaths.add(resolvedTsPath);
            }
            // Handle path aliases if tsConfigInfo exists
            else if (tsConfigInfo) {
                // Attempt to resolve using path aliases
                let resolved = false;
                for (const [alias, patterns] of Object.entries(tsConfigInfo.paths)) {
                    const aliasPrefix = alias.replace('*', '');
                    const aliasSuffix = alias.endsWith('*') ? '*' : '';

                    if (
                        importPath.startsWith(aliasPrefix) &&
                        (aliasSuffix === '*' || importPath === aliasPrefix)
                    ) {
                        const remainingImportPath = importPath.slice(aliasPrefix.length);
                        for (const pattern of patterns) {
                            const patternPrefix = pattern.replace('*', '');
                            const patternSuffix = pattern.endsWith('*') ? '*' : '';
                            // Ensure suffix match consistency (* vs exact)
                            if (aliasSuffix !== patternSuffix) continue;

                            const potentialPathBase = path.resolve(tsConfigInfo.baseUrl, patternPrefix);
                            const resolvedPath = path.join(potentialPathBase, remainingImportPath);

                            let resolvedTsPath = resolvedPath + '.ts';
                            // Similar existence checks as relative paths
                            if (!(await fs.pathExists(resolvedTsPath))) {
                                const resolvedTsxPath = resolvedPath + '.tsx';
                                if (await fs.pathExists(resolvedTsxPath)) {
                                    resolvedTsPath = resolvedTsxPath;
                                } else {
                                    const resolvedIndexPath = path.join(resolvedPath, 'index.ts');
                                    if (await fs.pathExists(resolvedIndexPath)) {
                                        resolvedTsPath = resolvedIndexPath;
                                    } else {
                                        const resolvedIndexTsxPath = path.join(resolvedPath, 'index.tsx');
                                        if (await fs.pathExists(resolvedIndexTsxPath)) {
                                            resolvedTsPath = resolvedIndexTsxPath;
                                        } else {
                                            // Path doesn't resolve to a file for this pattern
                                            continue;
                                        }
                                    }
                                }
                            }
                            // Add the first successful resolution for this alias
                            importPaths.add(resolvedTsPath);
                            resolved = true;
                            break; // Stop checking patterns for this alias
                        }
                    }
                    if (resolved) break; // Stop checking other aliases if resolved
                }
            }
            // For all other imports (node_modules, etc), we should still add them to be processed
            // by the TypeScript compiler, even if we can't resolve them to a file
            else {
                // Add the import path as is - TypeScript will handle resolution
                // importPaths.add(importPath);
            }
        } else {
            const children = node.getChildren();
            for (const child of children) {
                // Only process nodes that could contain import statements
                if (
                    ts.isSourceFile(child) ||
                    ts.isModuleBlock(child) ||
                    ts.isModuleDeclaration(child) ||
                    ts.isImportDeclaration(child) ||
                    child.kind === ts.SyntaxKind.SyntaxList
                ) {
                    await collectImports(child);
                }
            }
        }
    }

    // Start collecting imports from the source file
    await collectImports(sourceFile);

    const extractedPluginInfo = getPluginInfo(sourceFile);
    if (extractedPluginInfo) {
        pluginInfo.push(extractedPluginInfo);
    }

    // Store the tsConfigInfo on the first call if found
    const rootTsConfigInfo = isRoot ? tsConfigInfo : undefined;

    // Recursively collect all files that need to be compiled
    for (const importPath of importPaths) {
        // Pass rootTsConfigInfo down, but set isRoot to false
        await compileFile({
            inputRootDir,
            inputPath: importPath,
            outputDir,
            logger,
            transformTsConfigPathMappings,
            compiledFiles,
            isRoot: false,
            pluginInfo,
        });
    }

    // If this is the root file (the one that started the compilation),
    // use the TypeScript compiler API to compile all files together
    if (isRoot) {
        logger.info(`Starting compilation for ${compiledFiles.size} files...`);
        const allFiles = Array.from(compiledFiles);
        const compilerOptions: ts.CompilerOptions = {
            // Base options
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.CommonJS, // Output CommonJS for Node compatibility
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            esModuleInterop: true,
            skipLibCheck: true, // Faster compilation
            forceConsistentCasingInFileNames: true,
            moduleResolution: ts.ModuleResolutionKind.NodeJs, // Use Node.js module resolution
            incremental: false, // No need for incremental compilation
            noEmitOnError: false, // Continue emitting even with errors
            isolatedModules: true, // Treat files as separate modules
            strict: false, // Disable strict type checking for speed
            noUnusedLocals: false, // Skip unused locals check
            noUnusedParameters: false, // Skip unused parameters check

            // Output options
            outDir: outputDir, // Output directory for all compiled files
            sourceMap: false, // Generate source maps
            declaration: false, // Don't generate .d.ts files

            // Path resolution options - use info found from tsconfig
            baseUrl: rootTsConfigInfo ? rootTsConfigInfo.baseUrl : undefined, // Let TS handle resolution if no baseUrl
            paths: rootTsConfigInfo ? rootTsConfigInfo.paths : undefined,
            // rootDir: inputRootDir, // Often inferred correctly, can cause issues if set explicitly sometimes
            allowJs: true, // Allow JS files if needed, though we primarily collect TS
            resolveJsonModule: true, // Allow importing JSON
        };

        logger.debug(`compilerOptions: ${JSON.stringify(compilerOptions, null, 2)}`);

        // Create a Program to represent the compilation context
        const program = ts.createProgram(allFiles, compilerOptions);
        logger.info(`Emitting compiled files to ${outputDir}`);
        const emitResult = program.emit();

        if (reportCompilationErrors) {
            const hasEmitErrors = reportDiagnostics(program, emitResult, logger);

            if (hasEmitErrors) {
                throw new Error('TypeScript compilation failed with errors.');
            }
        }

        logger.info(`Successfully compiled ${allFiles.length} files to ${outputDir}`);
    }
    return pluginInfo;
}

function reportDiagnostics(program: ts.Program, emitResult: ts.EmitResult, logger: Logger) {
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    let hasEmitErrors = emitResult.emitSkipped;
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file && diagnostic.start) {
            const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            const logFn = diagnostic.category === ts.DiagnosticCategory.Error ? logger.warn : logger.info;
            // eslint-disable-next-line no-console
            console.log(
                `TS${diagnostic.code} ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
            );
            if (diagnostic.category === ts.DiagnosticCategory.Error) {
                hasEmitErrors = true;
            }
        } else {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            const logFn = diagnostic.category === ts.DiagnosticCategory.Error ? logger.warn : logger.info;
            // eslint-disable-next-line no-console
            console.log(`TS${diagnostic.code}: ${message}`);
            if (diagnostic.category === ts.DiagnosticCategory.Error) {
                hasEmitErrors = true;
            }
        }
    });
    return hasEmitErrors;
}
