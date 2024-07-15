/* eslint-disable no-console */
import fs from 'fs-extra';
import klawSync from 'klaw-sync';
import path, { extname } from 'path';

import { deleteGeneratedDocs, normalizeForUrlPart } from './docgen-utils';
import { TypeMap } from './typescript-docgen-types';
import { TypescriptDocsParser } from './typescript-docs-parser';
import { TypescriptDocsRenderer } from './typescript-docs-renderer';

interface DocsSectionConfig {
    sourceDirs: string[];
    exclude?: RegExp[];
    outputPath: string;
}

const sections: DocsSectionConfig[] = [
    {
        sourceDirs: ['packages/job-queue-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/core/src/', 'packages/common/src/', 'packages/testing/src/'],
        exclude: [/generated-shop-types/],
        outputPath: 'typescript-api',
    },
    {
        sourceDirs: ['packages/admin-ui-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/asset-server-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/email-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/elasticsearch-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/payments-plugin/src/'],
        exclude: [/generated-shop-types/],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/harden-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/stellate-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/sentry-plugin/src/'],
        outputPath: '',
    },
    {
        sourceDirs: ['packages/admin-ui/src/lib/', 'packages/ui-devkit/src/'],
        exclude: [/generated-types/],
        outputPath: 'admin-ui-api',
    },
];

generateTypescriptDocs(sections);

const watchMode = !!process.argv.find(arg => arg === '--watch' || arg === '-w');
if (watchMode) {
    console.log(`Watching for changes to source files...`);
    sections.forEach(section => {
        section.sourceDirs.forEach(dir => {
            fs.watch(dir, { recursive: true }, (eventType, file) => {
                if (file && extname(file) === '.ts') {
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

    for (const { outputPath, sourceDirs, exclude } of config) {
        const sourceFilePaths = getSourceFilePaths(sourceDirs, exclude);
        const docsPages = new TypescriptDocsParser().parse(sourceFilePaths);
        for (const page of docsPages) {
            const { category, fileName, declarations } = page;
            for (const declaration of declarations) {
                const pathToTypeDoc = `reference/${outputPath ? `${outputPath}/` : ''}${
                    category ? category.map(part => normalizeForUrlPart(part)).join('/') + '/' : ''
                }${fileName === 'index' ? '' : fileName}#${toHash(declaration.title)}`;
                globalTypeMap.set(declaration.title, pathToTypeDoc);
            }
        }
        const docsUrl = ``;
        const generatedCount = new TypescriptDocsRenderer().render(
            docsPages,
            docsUrl,
            absOutputPath(outputPath),
            globalTypeMap,
        );

        if (generatedCount) {
            console.log(
                `Generated ${generatedCount} typescript api docs for "${outputPath}" in ${
                    +new Date() - timeStart
                }ms`,
            );
        }
    }
}

function toHash(title: string): string {
    return title.replace(/\s/g, '').toLowerCase();
}

function absOutputPath(outputPath: string): string {
    return path.join(__dirname, '../../docs/docs/reference/', outputPath);
}

function getSourceFilePaths(sourceDirs: string[], excludePatterns: RegExp[] = []): string[] {
    return sourceDirs
        .map(scanPath =>
            klawSync(path.join(__dirname, '../../', scanPath), {
                nodir: true,
                filter: item => {
                    const ext = path.extname(item.path);
                    if (ext === '.ts' || ext === '.tsx') {
                        for (const pattern of excludePatterns) {
                            if (pattern.test(item.path)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                },
                traverseAll: true,
            }),
        )
        .reduce((allFiles, files) => [...allFiles, ...files], [])
        .map(item => item.path);
}
