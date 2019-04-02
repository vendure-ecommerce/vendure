/* tslint:disable:no-console */
import fs from 'fs';
import klawSync from 'klaw-sync';
import path from 'path';
import ts from 'typescript';

import { deleteGeneratedDocs } from './docgen-utils';
import { TypeMap } from './typescript-docgen-types';
import { TypescriptDocsParser } from './typescript-docs-parser';
import { TypescriptDocsRenderer } from './typescript-docs-renderer';

// The absolute URL to the generated docs section
const DOCS_URL = '/docs/configuration/';
// The directory in which the markdown files will be saved
const OUTPUT_PATH = path.join(__dirname, '../../docs/content/docs/configuration');
// The directories to scan for TypeScript source files
const TS_SOURCE_DIRS = ['packages/core/src/', 'packages/common/src/'];

const tsFiles = TS_SOURCE_DIRS
    .map(scanPath =>
        klawSync(path.join(__dirname, '../../', scanPath), {
            nodir: true,
            filter: item => path.extname(item.path) === '.ts',
            traverseAll: true,
        }),
    )
    .reduce((allFiles, files) => [...allFiles, ...files], [])
    .map(item => item.path);

deleteGeneratedDocs(OUTPUT_PATH);
generateTypescriptDocs(tsFiles, OUTPUT_PATH, DOCS_URL);

const watchMode = !!process.argv.find(arg => arg === '--watch' || arg === '-w');
if (watchMode) {
    console.log(`Watching for changes to source files...`);
    tsFiles.forEach(file => {
        fs.watchFile(file, { interval: 1000 }, () => {
            generateTypescriptDocs([file], OUTPUT_PATH, DOCS_URL);
        });
    });
}

/**
 * Uses the TypeScript compiler API to parse the given files and extract out the documentation
 * into markdown files
 */
function generateTypescriptDocs(filePaths: string[], hugoOutputPath: string, docsUrl: string) {
    const timeStart = +new Date();

    // This map is used to cache types and their corresponding Hugo path. It is used to enable
    // hyperlinking from a member's "type" to the definition of that type.
    const globalTypeMap: TypeMap = new Map();

    const parsedDeclarations = new TypescriptDocsParser().parse(filePaths);
    for (const info of parsedDeclarations) {
        globalTypeMap.set(info.title, info.category + '/' + info.fileName);
    }
    const generatedCount = new TypescriptDocsRenderer().render(parsedDeclarations, docsUrl, OUTPUT_PATH, globalTypeMap);

    if (generatedCount) {
        console.log(`Generated ${generatedCount} typescript api docs in ${+new Date() - timeStart}ms`);
    }
}
