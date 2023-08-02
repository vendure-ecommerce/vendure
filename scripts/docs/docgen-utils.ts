import fs from 'fs';
import klawSync from 'klaw-sync';
import { basename } from 'path';
/* eslint-disable no-console */

/**
 * Generates the Hugo front matter with the title of the document
 */
export function generateFrontMatter(title: string, isDefaultIndex = false): string {
    return `---
title: "${titleCase(title.replace(/-/g, ' '))}"
isDefaultIndex: ${isDefaultIndex ? 'true' : 'false'}
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';
`;
}

export function titleCase(input: string): string {
    return input
        .split(' ')
        .map(w => w[0].toLocaleUpperCase() + w.substr(1))
        .join(' ');
}

export function normalizeForUrlPart<T extends string | undefined>(input: T): T {
    if (input == null) {
        return input;
    }
    return input
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9-_/]/g, ' ')
        .replace(/\s+/g, '-')
        .toLowerCase() as T;
}

/**
 * Delete all generated docs found in the outputPath.
 */
export function deleteGeneratedDocs(outputPath: string) {
    if (!fs.existsSync(outputPath)) {
        return;
    }
    try {
        let deleteCount = 0;
        const files = klawSync(outputPath, { nodir: true });
        for (const file of files) {
            const content = fs.readFileSync(file.path, 'utf-8');
            if (isGenerated(content)) {
                fs.unlinkSync(file.path);
                deleteCount++;
            }
        }
        if (deleteCount) {
            console.log(`Deleted ${deleteCount} generated docs from ${outputPath}`);
        }
    } catch (e: any) {
        console.error('Could not delete generated docs!');
        console.log(e);
        process.exitCode = 1;
    }
}

/**
 * Returns true if the content matches that of a generated document.
 */
function isGenerated(content: string) {
    return /generated\: true\n---\n/.test(content);
}
