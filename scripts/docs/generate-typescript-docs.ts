/* tslint:disable:no-console */
import fs from 'fs-extra';
import klawSync from 'klaw-sync';
import path, { extname } from 'path';

import { deleteGeneratedDocs } from './docgen-utils';
import { TypeMap } from './typescript-docgen-types';
import { TypescriptDocsParser } from './typescript-docs-parser';
import { TypescriptDocsRenderer } from './typescript-docs-renderer';

interface DocsSectionConfig {
    sourceDirs: string[];
    outputPath: string;
}

const sections: DocsSectionConfig[] = [
    {
        sourceDirs: ['packages/core/src/', 'packages/common/src/'],
        outputPath: 'typescript-api',
    },
    {
        sourceDirs: ['packages/asset-server-plugin/src/'],
        outputPath: 'plugins',
    },
    {
        sourceDirs: ['packages/email-plugin/src/'],
        outputPath: 'plugins',
    },
    {
        sourceDirs: ['packages/admin-ui-plugin/src/'],
        outputPath: 'plugins',
    },
    {
        sourceDirs: ['packages/elasticsearch-plugin/src/'],
        outputPath: 'plugins',
    },
];

generateTypescriptDocs(sections);

const watchMode = !!process.argv.find(arg => arg === '--watch' || arg === '-w');
if (watchMode) {
    console.log(`Watching for changes to source files...`);
    sections.forEach(section => {
        section.sourceDirs.forEach(dir => {
            fs.watch(dir, { recursive: true }, (eventType, file) => {
                if (extname(file) === '.ts') {
                    console.log(`Changes detected in ${dir}`);
                    generateTypescriptDocs([section], true);
                }
            });
        });
    });
}

/**
 * Uses the TypeScript compiler API to parse the given files and extract out the documentation
 * into markdown files
 */
function generateTypescriptDocs(config: DocsSectionConfig[], isWatchMode: boolean = false) {
    const timeStart = +new Date();

    // This map is used to cache types and their corresponding Hugo path. It is used to enable
    // hyperlinking from a member's "type" to the definition of that type.
    const globalTypeMap: TypeMap = new Map();

    if (!isWatchMode) {
        for (const { outputPath, sourceDirs } of config) {
            deleteGeneratedDocs(absOutputPath(outputPath));
        }
    }

    for (const { outputPath, sourceDirs } of config) {
        const sourceFilePaths = getSourceFilePaths(sourceDirs);
        const docsPages = new TypescriptDocsParser().parse(sourceFilePaths);
        for (const page of docsPages) {
            const { category, fileName, declarations } = page;
            for (const declaration of declarations) {
                const pathToTypeDoc = `${outputPath}/${category ? category + '/' : ''}${
                    fileName === '_index' ? '' : fileName
                }#${toHash(declaration.title)}`;
                globalTypeMap.set(declaration.title, pathToTypeDoc);
            }
        }
        const docsUrl = `/docs`;
        const generatedCount = new TypescriptDocsRenderer().render(
            docsPages,
            docsUrl,
            absOutputPath(outputPath),
            globalTypeMap,
        );

        if (generatedCount) {
            console.log(
                `Generated ${generatedCount} typescript api docs for "${outputPath}" in ${+new Date() -
                    timeStart}ms`,
            );
        }
    }
}

function toHash(title: string): string {
    return title.replace(/\s/g, '').toLowerCase();
}

function absOutputPath(outputPath: string): string {
    return path.join(__dirname, '../../docs/content/docs/', outputPath);
}

function getSourceFilePaths(sourceDirs: string[]): string[] {
    return sourceDirs
        .map(scanPath =>
            klawSync(path.join(__dirname, '../../', scanPath), {
                nodir: true,
                filter: item => path.extname(item.path) === '.ts',
                traverseAll: true,
            }),
        )
        .reduce((allFiles, files) => [...allFiles, ...files], [])
        .map(item => item.path);
}
