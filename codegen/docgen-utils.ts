import fs from 'fs';
import klawSync from 'klaw-sync';
// tslint:disable:no-console

/**
 * Generates the Hugo front matter with the title of the document
 */
export function generateFrontMatter(title: string, weight: number, showToc: boolean = true): string {
    return `---
title: "${title.replace('-', ' ')}"
weight: ${weight}
date: ${new Date().toISOString()}
showtoc: ${showToc}
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
`;
}

/**
 * Delete all generated docs found in the outputPath.
 */
export function deleteGeneratedDocs(outputPath: string) {
    let deleteCount = 0;
    const files = klawSync(outputPath, {nodir: true});
    for (const file of files) {
        const content = fs.readFileSync(file.path, 'utf-8');
        if (isGenerated(content)) {
            fs.unlinkSync(file.path);
            deleteCount++;
        }
    }
    console.log(`Deleted ${deleteCount} generated docs`);
}

/**
 * Returns true if the content matches that of a generated document.
 */
function isGenerated(content: string) {
    return /generated\: true\n---\n/.test(content);
}
