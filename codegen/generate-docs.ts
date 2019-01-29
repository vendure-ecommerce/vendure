import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ts from 'typescript';

const outputPath = path.join(__dirname, '../docs/content/docs/api');
const vendureConfig = path.join(__dirname, '../server/src/config/vendure-config.ts');

// Parse a file
const sourceFile = ts.createSourceFile(
    vendureConfig,
    readFileSync(vendureConfig).toString(),
    ts.ScriptTarget.ES2015,
    true,
);

for (const statement of [...sourceFile.statements]) {
    if (ts.isInterfaceDeclaration(statement)) {
        const title = statement.name.text;
        const frontMatter = generateFrontMatter(statement);
        const body = generateInterfaceDocs(statement);

        const fileName = getGeneratedFileName(title);
        const contents = `${frontMatter}\n${body}`;
        writeFileSync(path.join(outputPath, fileName), contents);
    }
}

/**
 * Generates the body of a TypeScript interface documentation markdown file.
 */
function generateInterfaceDocs(statement: ts.InterfaceDeclaration): string {
    let output = `## ${statement.name.text}\n\n`;
    for (const member of statement.members) {
        if (ts.isPropertySignature(member)) {
            let description = '';
            let type = '';
            let defaultVal = '';
            const jsDocTags = ts.getJSDocTags(member);
            for (const tag of jsDocTags) {
                if (tag.tagName.text === 'description') {
                    description = tag.comment || '';
                }
                if (tag.tagName.text === 'example') {
                    description += formatExampleCode(tag.comment);
                }
                if (tag.tagName.text === 'default') {
                    defaultVal = tag.comment || '';
                }
            }
            if (member.type) {
                type = member.type.getFullText();
            }
            output += `### ${member.name.getText()}\n\n`;
            output += `{{< config-option type="${type}" default="${defaultVal}" >}}\n\n`;
            output += `${description}\n\n`;
        }
    }

    return output;
}

/**
 * Generates the Hugo front matter with the title of the document
 */
function generateFrontMatter(statement: ts.InterfaceDeclaration): string {
    return `---
title: "${statement.name.text}"
weight: 0
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->
`;
}

/**
 * Cleans up a JSDoc "@example" block by removing leading whitespace and asterisk (TypeScript has an open issue
 * wherein the asterisks are not stripped as they should be, see https://github.com/Microsoft/TypeScript/issues/23517)
 */
function formatExampleCode(example: string = ''): string {
    return '\n\n' + example.replace(/\n\s+\*\s/g, '');
}

/**
 * Generates a markdown filename from a normalized version of the title.
 */
function getGeneratedFileName(title: string): string {
    return title.split(/(?=[A-Z])/).join('-').toLowerCase() + '.md';
}
