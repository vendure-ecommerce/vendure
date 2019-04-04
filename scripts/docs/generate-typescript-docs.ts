/* tslint:disable:no-console */
import klawSync from 'klaw-sync';
import path from 'path';

import { deleteGeneratedDocs } from './docgen-utils';
import { TypeMap } from './typescript-docgen-types';
import { TypescriptDocsParser } from './typescript-docs-parser';
import { TypescriptDocsRenderer } from './typescript-docs-renderer';

interface DocsSectionCofig {
    sourceDirs: string[];
    outputPath: string;
}

generateTypescriptDocs([
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
]);

/*const watchMode = !!process.argv.find(arg => arg === '--watch' || arg === '-w');
if (watchMode) {
    console.log(`Watching for changes to source files...`);
    tsFiles.forEach(file => {
        fs.watchFile(file, { interval: 1000 }, () => {
            generateTypescriptDocs([file], OUTPUT_PATH, DOCS_URL);
        });
    });
}*/

/**
 * Uses the TypeScript compiler API to parse the given files and extract out the documentation
 * into markdown files
 */
function generateTypescriptDocs(config: DocsSectionCofig[]) {
    const timeStart = +new Date();

    // This map is used to cache types and their corresponding Hugo path. It is used to enable
    // hyperlinking from a member's "type" to the definition of that type.
    const globalTypeMap: TypeMap = new Map();

    for (const { outputPath, sourceDirs } of config) {
        deleteGeneratedDocs(absOutputPath(outputPath));
    }

    for (const { outputPath, sourceDirs } of config) {
        const sourceFilePaths = getSourceFilePaths(sourceDirs);
        const parsedDeclarations = new TypescriptDocsParser().parse(sourceFilePaths);
        for (const info of parsedDeclarations) {
            globalTypeMap.set(info.title, info.category + '/' + info.fileName);
        }
        const docsUrl = `/docs/${outputPath}`;
        const generatedCount = new TypescriptDocsRenderer().render(
            parsedDeclarations,
            docsUrl,
            absOutputPath(outputPath),
            globalTypeMap,
        );

        if (generatedCount) {
            console.log(`Generated ${generatedCount} typescript api docs for "${outputPath}" in ${+new Date() - timeStart}ms`);
        }
    }
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
