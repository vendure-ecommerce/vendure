import { Options, parse, transform } from '@swc/core';
import { BindingIdentifier, ModuleItem, Pattern, Statement } from '@swc/types';
import { VendureConfig } from '@vendure/core';
import fs from 'fs-extra';
import path from 'path';
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
 * To work around this, we compile the Vendure config file and all its imports using SWC, which does support
 * these experimental decorators. The compiled files are then loaded by Vite, which is able to handle the compiled
 * JavaScript output.
 */
export async function loadVendureConfig(
    options: ConfigLoaderOptions,
): Promise<{ vendureConfig: VendureConfig; exportedSymbolName: string }> {
    const { vendureConfigPath, vendureConfigExport, tempDir } = options;
    const outputPath = tempDir;
    const configFileName = path.basename(vendureConfigPath);
    await fs.remove(outputPath);
    await compileFile(vendureConfigPath, path.join(import.meta.dirname, './.vendure-dashboard-temp'));
    const compiledConfigFilePath = pathToFileURL(path.join(outputPath, configFileName)).href.replace(
        /.ts$/,
        '.js',
    );
    // create package.json with type commonjs and save it to the output dir
    await fs.writeFile(path.join(outputPath, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2));

    // We need to figure out the symbol exported by the config file by
    // analyzing the AST and finding an export with the type "VendureConfig"
    const ast = await parse(await fs.readFile(vendureConfigPath, 'utf-8'), {
        syntax: 'typescript',
        decorators: true,
    });
    const detectedExportedSymbolName = findConfigExport(ast.body);
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
function findConfigExport(statements: ModuleItem[]): string | undefined {
    for (const statement of statements) {
        if (statement.type === 'ExportDeclaration') {
            if (statement.declaration.type === 'VariableDeclaration') {
                for (const declaration of statement.declaration.declarations) {
                    if (isBindingIdentifier(declaration.id)) {
                        const typeRef = declaration.id.typeAnnotation?.typeAnnotation;
                        if (typeRef?.type === 'TsTypeReference') {
                            if (
                                typeRef.typeName.type === 'Identifier' &&
                                typeRef.typeName.value === 'VendureConfig'
                            ) {
                                return declaration.id.value;
                            }
                        }
                    }
                }
            }
        }
    }
    return undefined;
}

function isBindingIdentifier(id: Pattern): id is BindingIdentifier {
    return id.type === 'Identifier' && !!(id as BindingIdentifier).typeAnnotation;
}

export async function compileFile(
    inputPath: string,
    outputDir: string,
    compiledFiles = new Set<string>(),
): Promise<void> {
    if (compiledFiles.has(inputPath)) {
        return;
    }
    compiledFiles.add(inputPath);

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Read the source file
    const source = await fs.readFile(inputPath, 'utf-8');

    // Transform config
    const config: Options = {
        filename: inputPath,
        sourceMaps: true,
        jsc: {
            parser: {
                syntax: 'typescript',
                tsx: false,
                decorators: true,
            },
            target: 'es2020',
            loose: false,
            transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
            },
        },
        module: {
            type: 'commonjs',
            strict: true,
            strictMode: true,
            lazy: false,
            noInterop: false,
        },
    };

    // Transform the code using SWC
    const result = await transform(source, config);

    // Generate output file path
    const relativePath = path.relative(process.cwd(), inputPath);
    const outputPath = path.join(outputDir, relativePath).replace(/\.ts$/, '.js');

    // Ensure the subdirectory for the output file exists
    await fs.ensureDir(path.dirname(outputPath));

    // Write the transformed code
    await fs.writeFile(outputPath, result.code);

    // Write source map if available
    if (result.map) {
        await fs.writeFile(`${outputPath}.map`, JSON.stringify(result.map));
    }

    // Parse the source to find relative imports
    const ast = await parse(source, { syntax: 'typescript', decorators: true });
    const importPaths = new Set<string>();

    function collectImports(node: any) {
        if (node.type === 'ImportDeclaration' && node.source.value.startsWith('.')) {
            const importPath = path.resolve(path.dirname(inputPath), node.source.value);
            importPaths.add(importPath + '.ts');
        }
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                collectImports(node[key]);
            }
        }
    }

    collectImports(ast);

    // Recursively compile all relative imports
    for (const importPath of importPaths) {
        await compileFile(importPath, outputDir, compiledFiles);
    }
}
