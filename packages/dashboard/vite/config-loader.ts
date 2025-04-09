import { VendureConfig } from '@vendure/core';
import fs from 'fs-extra';
import path from 'path';
import * as ts from 'typescript';
import { pathToFileURL } from 'url';

export interface ConfigLoaderOptions {
    vendureConfigPath: string;
    tempDir: string;
    vendureConfigExport?: string;
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
export async function loadVendureConfig(
    options: ConfigLoaderOptions,
): Promise<{ vendureConfig: VendureConfig; exportedSymbolName: string }> {
    const { vendureConfigPath, vendureConfigExport, tempDir } = options;
    const outputPath = tempDir;
    const configFileName = path.basename(vendureConfigPath);
    const inputRootDir = path.dirname(vendureConfigPath);
    await fs.remove(outputPath);
    await compileFile(inputRootDir, vendureConfigPath, outputPath);
    const compiledConfigFilePath = pathToFileURL(path.join(outputPath, configFileName)).href.replace(
        /.ts$/,
        '.js',
    );
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
    const config = await import(compiledConfigFilePath).then(m => m[configExportedSymbolName]);
    if (!config) {
        throw new Error(
            `Could not find a variable exported as VendureConfig with the name "${configExportedSymbolName}".`,
        );
    }
    return { vendureConfig: config, exportedSymbolName: configExportedSymbolName };
}

/**
 * Given the AST of a TypeScript file, finds the name of the variable exported as VendureConfig.
 */
function findConfigExport(sourceFile: ts.SourceFile): string | undefined {
    let exportedSymbolName: string | undefined;

    function visit(node: ts.Node) {
        if (
            ts.isVariableStatement(node) &&
            node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
        ) {
            node.declarationList.declarations.forEach(declaration => {
                if (ts.isVariableDeclaration(declaration)) {
                    const typeNode = declaration.type;
                    if (typeNode && ts.isTypeReferenceNode(typeNode)) {
                        const typeName = typeNode.typeName;
                        if (ts.isIdentifier(typeName) && typeName.text === 'VendureConfig') {
                            if (ts.isIdentifier(declaration.name)) {
                                exportedSymbolName = declaration.name.text;
                            }
                        }
                    }
                }
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return exportedSymbolName;
}

export async function compileFile(
    inputRootDir: string,
    inputPath: string,
    outputDir: string,
    compiledFiles = new Set<string>(),
    isRoot = true,
): Promise<void> {
    if (compiledFiles.has(inputPath)) {
        return;
    }
    compiledFiles.add(inputPath);

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Read the source file
    const source = await fs.readFile(inputPath, 'utf-8');

    // Parse the source to find relative imports
    const sourceFile = ts.createSourceFile(inputPath, source, ts.ScriptTarget.Latest, true);

    const importPaths = new Set<string>();

    function collectImports(node: ts.Node) {
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
            const importPath = node.moduleSpecifier.text;
            if (importPath.startsWith('.')) {
                const resolvedPath = path.resolve(path.dirname(inputPath), importPath);
                importPaths.add(resolvedPath + '.ts');
            }
        }
        ts.forEachChild(node, collectImports);
    }

    collectImports(sourceFile);

    // Recursively collect all files that need to be compiled
    for (const importPath of importPaths) {
        await compileFile(inputRootDir, importPath, outputDir, compiledFiles, false);
    }

    // If this is the root file (the one that started the compilation),
    // transpile all files
    if (isRoot) {
        const allFiles = Array.from(compiledFiles);
        for (const file of allFiles) {
            const fileSource = await fs.readFile(file, 'utf-8');
            const result = ts.transpileModule(fileSource, {
                compilerOptions: {
                    target: ts.ScriptTarget.ES2020,
                    module: ts.ModuleKind.CommonJS,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    sourceMap: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                },
                fileName: file,
            });

            // Generate output file path
            const relativePath = path.relative(inputRootDir, file);
            const outputPath = path.join(outputDir, relativePath).replace(/\.ts$/, '.js');

            // Ensure the subdirectory for the output file exists
            await fs.ensureDir(path.dirname(outputPath));

            // Write the transpiled code
            await fs.writeFile(outputPath, result.outputText);

            // Write source map if available
            if (result.sourceMapText) {
                await fs.writeFile(`${outputPath}.map`, result.sourceMapText);
            }
        }
    }
}
