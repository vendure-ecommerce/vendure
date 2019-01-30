import fs from 'fs';
import klawSync from 'klaw-sync';
import path from 'path';
import ts from 'typescript';

import { notNullOrUndefined } from '../shared/shared-utils';

// tslint:disable:no-console
interface MethodParameterInfo {
    name: string;
    type: string;
}

interface MemberInfo {
    name: string;
    description: string;
    type: string;
}

interface PropertyInfo extends MemberInfo {
    kind: 'property';
    defaultValue: string;
}

interface MethodInfo extends MemberInfo {
    kind: 'method';
    parameters: MethodParameterInfo[];
}

interface InterfaceInfo {
    sourceFile: string;
    title: string;
    weight: number;
    category: string;
    description: string;
    fileName: string;
    members: Array<PropertyInfo | MethodInfo>;
}

type TypeMap = Map<string, string>;

const docsPath = '/docs/api/';
const outputPath = path.join(__dirname, '../docs/content/docs/api');

/**
 * This map is used to cache types and their corresponding Hugo path. It is used to enable
 * hyperlinking from a member's "type" to the definition of that type.
 */
const globalTypeMap: TypeMap = new Map();

const tsFiles = klawSync(path.join(__dirname, '../server/src/'), {
    nodir: true,
    filter: item => path.extname(item.path) === '.ts',
    traverseAll: true,
}).map(item => item.path);

deleteGeneratedDocs();
generateDocs(tsFiles, outputPath, globalTypeMap);
const watchMode = !!process.argv.find(arg => arg === '--watch' || arg === '-w');
if (watchMode) {
    console.log(`Watching for changes to source files...`);
    tsFiles.forEach(file => {
        fs.watchFile(file, { interval: 1000 }, () => {
            generateDocs([file], outputPath, globalTypeMap);
        });
    });
}

/**
 * Delete all generated docs found in the outputPath.
 */
function deleteGeneratedDocs() {
    let deleteCount = 0;
    const files = klawSync(outputPath, { nodir: true });
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

/**
 * Uses the TypeScript compiler API to parse the given files and extract out the documentation
 * into markdown files
 * @param filePaths
 * @param typeMap
 */
function generateDocs(filePaths: string[], hugoApiDocsPath: string, typeMap: TypeMap) {
    const timeStart = +new Date();
    const sourceFiles = filePaths.map(filePath => {
        return ts.createSourceFile(
            filePath,
            fs.readFileSync(filePath).toString(),
            ts.ScriptTarget.ES2015,
            true,
        );
    });

    const interfaces = getStatementsWithSourceFile(sourceFiles)
        .filter(s => ts.isInterfaceDeclaration(s.statement))
        .map(statement => {
            const info = parseInterface(statement.statement as ts.InterfaceDeclaration, statement.sourceFile);
            if (info) {
                typeMap.set(info.title, info.category + '/' + info.fileName);
            }
            return info;
        })
        .filter(notNullOrUndefined);

    for (const info of interfaces) {
        const markdown = renderInterface(info, typeMap);
        const categoryDir = path.join(hugoApiDocsPath, info.category);
        const indexFile = path.join(categoryDir, '_index.md');
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir);
        }
        if (!fs.existsSync(indexFile)) {
            const indexFileContent = generateFrontMatter(info.category, 10, false) + `\n\n# ${info.category}`;
            fs.writeFileSync(indexFile, indexFileContent);
        }

        fs.writeFileSync(path.join(categoryDir, info.fileName + '.md'), markdown);
    }

    if (interfaces.length) {
        console.log(`Generated ${interfaces.length} docs in ${+new Date() - timeStart}ms`);
    }
}

/**
 * Maps an array of parsed SourceFiles into statements, including a reference to the original file each statement
 * came from.
 */
function getStatementsWithSourceFile(sourceFiles: ts.SourceFile[]): Array<{ statement: ts.Statement; sourceFile: string }> {
    return sourceFiles.reduce(
        (st, sf) => {
            const statementsWithSources = sf.statements.map(statement => {
                const serverSourceRoot = '/server/src';
                const sourceFile = sf.fileName.substring(sf.fileName.indexOf(serverSourceRoot));
                return {statement, sourceFile };
            });
            return [...st, ...statementsWithSources];
        },
        [] as Array<{ statement: ts.Statement; sourceFile: string }>,
    );
}

/**
 * Parses an InterfaceDeclaration into a simple object which can be rendered into markdown.
 */
function parseInterface(statement: ts.InterfaceDeclaration, sourceFile: string): InterfaceInfo | undefined {
    const category = getDocsCategory(statement);
    if (category === undefined) {
        return;
    }
    const title = statement.name.text;
    const weight = getInterfaceWeight(statement);
    const description = getInterfaceDescription(statement);
    const fileName = title
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();
    const members = parseMembers(statement.members);
    return {
        sourceFile,
        title,
        weight,
        category,
        description,
        fileName,
        members,
    };
}

/**
 * Parses an array of inteface members into a simple object which can be rendered into markdown.
 */
function parseMembers(members: ts.NodeArray<ts.TypeElement>): Array<PropertyInfo | MethodInfo> {
    const result: Array<PropertyInfo | MethodInfo> = [];

    for (const member of members) {
        if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
            const name = member.name.getText();
            let description = '';
            let type = '';
            let defaultValue = '';
            let parameters: MethodParameterInfo[] = [];
            parseTags(member, {
                description: tag => (description += tag.comment || ''),
                example: tag => (description += formatExampleCode(tag.comment)),
                default: tag => (defaultValue = tag.comment || ''),
            });
            if (member.type) {
                type = member.type.getFullText();
            }
            if (ts.isMethodSignature(member)) {
                parameters = member.parameters.map(p => ({
                    name: p.name.getText(),
                    type: p.type ? p.type.getFullText() : '',
                }));
                result.push({
                    kind: 'method',
                    name,
                    description,
                    type,
                    parameters,
                });
            } else {
                result.push({
                    kind: 'property',
                    name,
                    description,
                    type,
                    defaultValue,
                });
            }
        }
    }

    return result;
}

function renderInterface(interfaceInfo: InterfaceInfo, knownTypeMap: Map<string, string>): string {
    const { title, weight, category, description, members } = interfaceInfo;
    let output = '';
    output += generateFrontMatter(title, weight);
    output += `\n\n# ${title}\n\n`;
    output += `{{< generation-info source="${interfaceInfo.sourceFile}">}}\n\n`;
    output += `${description}\n\n`;

    for (const member of members) {
        let defaultParam = '';
        let type = '';
        if (member.kind === 'property') {
            type = renderType(member.type, knownTypeMap);
            defaultParam = member.defaultValue ? `default="${member.defaultValue}" ` : '';
        } else {
            const args = member.parameters
                .map(p => {
                    return `${p.name}: ${renderType(p.type, knownTypeMap)}`;
                })
                .join(', ');
            type = `(${args}) => ${renderType(member.type, knownTypeMap)}`;
        }
        output += `### ${member.name}\n\n`;
        output += `{{< member-info kind="${member.kind}" type="${type}" ${defaultParam}>}}\n\n`;
        output += `${member.description}\n\n`;
    }

    return output;
}

/**
 * Extracts the "@docsCategory" value from the JSDoc comments if present.
 */
function getDocsCategory(statement: ts.InterfaceDeclaration): string | undefined {
    let category: string | undefined;
    parseTags(statement, {
        docsCategory: tag => (category = tag.comment || ''),
    });
    return category;
}

/**
 * Parses the Node's JSDoc tags and invokes the supplied functions against any matching tag names.
 */
function parseTags<T extends ts.Node>(
    node: T,
    tagMatcher: { [tagName: string]: (tag: ts.JSDocTag) => void },
): void {
    const jsDocTags = ts.getJSDocTags(node);
    for (const tag of jsDocTags) {
        const tagName = tag.tagName.text;
        if (tagMatcher[tagName]) {
            tagMatcher[tagName](tag);
        }
    }
}

/**
 * This function takes a string representing a type (e.g. "Array<ShippingMethod>") and turns
 * and known types (e.g. "ShippingMethod") into hyperlinks.
 */
function renderType(type: string, knownTypeMap: Map<string, string>): string {
    let typeText = type
        .trim()
        // encode HTML entities
        .replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')
        // remove newlines
        .replace(/\n/g, ' ');

    for (const [key, val] of knownTypeMap) {
        typeText = typeText.replace(key, `<a href='${docsPath}/${val}/'>${key}</a>`);
    }
    return typeText;
}

/**
 * Generates the Hugo front matter with the title of the document
 */
function generateFrontMatter(title: string, weight: number, showToc: boolean = true): string {
    return `---
title: "${title}"
weight: ${weight}
date: ${new Date().toISOString()}
showtoc: ${showToc}
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->
`;
}

/**
 * Reads the @docsWeight JSDoc tag from the interface.
 */
function getInterfaceWeight(statement: ts.InterfaceDeclaration): number {
    let weight = 10;
    parseTags(statement, {
        docsWeight: tag => (weight = Number.parseInt(tag.comment || '10', 10)),
    });
    return weight;
}

/**
 * Reads the @description JSDoc tag from the interface.
 */
function getInterfaceDescription(statement: ts.InterfaceDeclaration): string {
    let description = '';
    parseTags(statement, {
        description: tag => (description += tag.comment),
    });
    return description;
}

/**
 * Cleans up a JSDoc "@example" block by removing leading whitespace and asterisk (TypeScript has an open issue
 * wherein the asterisks are not stripped as they should be, see https://github.com/Microsoft/TypeScript/issues/23517)
 */
function formatExampleCode(example: string = ''): string {
    return '\n\n' + example.replace(/\n\s+\*\s/g, '');
}
