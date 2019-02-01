import fs from 'fs';
import klawSync from 'klaw-sync';
import path from 'path';
import ts from 'typescript';

import { assertNever, notNullOrUndefined } from '../shared/shared-utils';

import { deleteGeneratedDocs, generateFrontMatter } from './docgen-utils';

// The absolute URL to the generated docs section
const docsUrl = '/docs/configuration/';
// The directory in which the markdown files will be saved
const outputPath = path.join(__dirname, '../docs/content/docs/configuration');
// The directories to scan for TypeScript source files
const tsSourceDirs = [
    '/server/src/',
    '/shared/',
];

// tslint:disable:no-console
interface MethodParameterInfo {
    name: string;
    type: string;
}

interface MemberInfo {
    name: string;
    description: string;
    type: string;
    fullText: string;
}

interface PropertyInfo extends MemberInfo {
    kind: 'property';
    defaultValue: string;
}

interface MethodInfo extends MemberInfo {
    kind: 'method';
    parameters: MethodParameterInfo[];
}

interface DeclarationInfo {
    sourceFile: string;
    sourceLine: number;
    title: string;
    fullText: string;
    weight: number;
    category: string;
    description: string;
    fileName: string;
}

interface InterfaceInfo extends DeclarationInfo {
    kind: 'interface';
    members: Array<PropertyInfo | MethodInfo>;
}

interface ClassInfo extends DeclarationInfo {
    kind: 'class';
    members: Array<PropertyInfo | MethodInfo>;
}

interface TypeAliasInfo extends DeclarationInfo {
    kind: 'typeAlias';
    type: string;
}

type ValidDeclaration = ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.ClassDeclaration;
type TypeMap = Map<string, string>;

/**
 * This map is used to cache types and their corresponding Hugo path. It is used to enable
 * hyperlinking from a member's "type" to the definition of that type.
 */
const globalTypeMap: TypeMap = new Map();

const tsFiles = tsSourceDirs
    .map(scanPath => klawSync( path.join(__dirname, '../', scanPath), {
        nodir: true,
        filter: item => path.extname(item.path) === '.ts',
        traverseAll: true,
    }))
    .reduce((allFiles, files) => [...allFiles, ...files], [])
    .map(item => item.path);

deleteGeneratedDocs(outputPath);
generateConfigDocs(tsFiles, outputPath, globalTypeMap);
const watchMode = !!process.argv.find(arg => arg === '--watch' || arg === '-w');
if (watchMode) {
    console.log(`Watching for changes to source files...`);
    tsFiles.forEach(file => {
        fs.watchFile(file, { interval: 1000 }, () => {
            generateConfigDocs([file], outputPath, globalTypeMap);
        });
    });
}

/**
 * Uses the TypeScript compiler API to parse the given files and extract out the documentation
 * into markdown files
 */
function generateConfigDocs(filePaths: string[], hugoOutputPath: string, typeMap: TypeMap) {
    const timeStart = +new Date();
    let generatedCount = 0;
    const sourceFiles = filePaths.map(filePath => {
        return ts.createSourceFile(
            filePath,
            fs.readFileSync(filePath).toString(),
            ts.ScriptTarget.ES2015,
            true,
        );
    });

    const statements = getStatementsWithSourceLocation(sourceFiles);

    const declarationInfos = statements
        .map(statement => {
            const info = parseDeclaration(statement.statement, statement.sourceFile, statement.sourceLine);
            if (info) {
                typeMap.set(info.title, info.category + '/' + info.fileName);
            }
            return info;
        })
        .filter(notNullOrUndefined);

    for (const info of declarationInfos) {
        let markdown = '';
        switch (info.kind) {
            case 'interface':
                markdown = renderInterfaceOrClass(info, typeMap);
                break;
            case 'typeAlias':
                markdown = renderTypeAlias(info, typeMap);
                break;
            case 'class':
                markdown = renderInterfaceOrClass(info as any, typeMap);
                break;
            default:
                assertNever(info);
        }

        const categoryDir = path.join(hugoOutputPath, info.category);
        const indexFile = path.join(categoryDir, '_index.md');
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir);
        }
        if (!fs.existsSync(indexFile)) {
            const indexFileContent = generateFrontMatter(info.category, 10, false) + `\n\n# ${info.category}`;
            fs.writeFileSync(indexFile, indexFileContent);
            generatedCount ++;
        }

        fs.writeFileSync(path.join(categoryDir, info.fileName + '.md'), markdown);
        generatedCount ++;
    }

    if (declarationInfos.length) {
        console.log(`Generated ${generatedCount} configuration docs in ${+new Date() - timeStart}ms`);
    }
}

/**
 * Maps an array of parsed SourceFiles into statements, including a reference to the original file each statement
 * came from.
 */
function getStatementsWithSourceLocation(
    sourceFiles: ts.SourceFile[],
): Array<{ statement: ts.Statement; sourceFile: string; sourceLine: number }> {
    return sourceFiles.reduce(
        (st, sf) => {
            const statementsWithSources = sf.statements.map(statement => {
                const sourceFile = path.relative(path.join(__dirname, '..'), sf.fileName).replace(/\\/g, '/');
                const sourceLine = sf.getLineAndCharacterOfPosition(statement.getStart()).line + 1;
                return { statement, sourceFile, sourceLine };
            });
            return [...st, ...statementsWithSources];
        },
        [] as Array<{ statement: ts.Statement; sourceFile: string; sourceLine: number }>,
    );
}

/**
 * Parses an InterfaceDeclaration into a simple object which can be rendered into markdown.
 */
function parseDeclaration(
    statement: ts.Statement,
    sourceFile: string,
    sourceLine: number,
): InterfaceInfo | TypeAliasInfo | ClassInfo | undefined {
    if (!isValidDeclaration(statement)) {
        return;
    }
    const category = getDocsCategory(statement);
    if (category === undefined) {
        return;
    }
    const title = statement.name ? statement.name.getText() : 'anonymous';
    const fullText = getDeclarationFullText(statement);
    const weight = getDeclarationWeight(statement);
    const description = getDeclarationDescription(statement);
    const fileName = title
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();

    const info = {
        sourceFile,
        sourceLine,
        fullText,
        title,
        weight,
        category,
        description,
        fileName,
    };

    if (ts.isInterfaceDeclaration(statement)) {
        return {
            ...info,
            kind: 'interface',
            members: parseMembers(statement.members),
        };
    } else if (ts.isTypeAliasDeclaration(statement)) {
        return {
            ...info,
            type: statement.type.getText().trim(),
            kind: 'typeAlias',
        };
    } else if (ts.isClassDeclaration(statement)) {
        return {
            ...info,
            kind: 'class',
            members: parseMembers(statement.members),
        };
    }
}

/**
 * Returns the declaration name plus any type parameters.
 */
function getDeclarationFullText(declaration: ValidDeclaration): string {
    const name = declaration.name ? declaration.name.getText() : 'anonymous';
    let typeParams = '';
    if (declaration.typeParameters) {
        typeParams = '<' + declaration.typeParameters.map(tp => tp.getText()).join(', ') + '>';
    }
    return name + typeParams;
}

/**
 * Parses an array of inteface members into a simple object which can be rendered into markdown.
 */
function parseMembers(
    members: ts.NodeArray<ts.TypeElement | ts.ClassElement>,
): Array<PropertyInfo | MethodInfo> {
    const result: Array<PropertyInfo | MethodInfo> = [];

    for (const member of members) {
        const modifiers = member.modifiers ? member.modifiers.map(m => m.getText()) : [];
        const isPrivate = modifiers.includes('private');
        if (
            !isPrivate && (
            ts.isPropertySignature(member) ||
            ts.isMethodSignature(member) ||
            ts.isPropertyDeclaration(member) ||
            ts.isMethodDeclaration(member) ||
            ts.isConstructorDeclaration(member)
            )
        ) {
            const name = member.name ? member.name.getText() : 'constructor';
            let description = '';
            let type = '';
            let defaultValue = '';
            let parameters: MethodParameterInfo[] = [];
            let fullText = '';
            if (ts.isConstructorDeclaration(member)) {
                fullText = 'constructor';
            } else if (ts.isMethodDeclaration(member)) {
                fullText = member.name.getText();
            } else {
                fullText = member.getText();
            }
            parseTags(member, {
                description: tag => (description += tag.comment || ''),
                example: tag => (description += formatExampleCode(tag.comment)),
                default: tag => (defaultValue = tag.comment || ''),
            });
            if (member.type) {
                type = member.type.getText();
            }
            const memberInfo: MemberInfo = {
                fullText,
                name,
                description,
                type,
            };
            if (
                ts.isMethodSignature(member) ||
                ts.isMethodDeclaration(member) ||
                ts.isConstructorDeclaration(member)
            ) {
                parameters = member.parameters.map(p => ({
                    name: p.name.getText(),
                    type: p.type ? p.type.getText() : '',
                }));
                result.push({
                    ...memberInfo,
                    kind: 'method',
                    parameters,
                });
            } else {
                result.push({
                    ...memberInfo,
                    kind: 'property',
                    defaultValue,
                });
            }
        }
    }

    return result;
}

/**
 * Render the interface to a markdown string.
 */
function renderInterfaceOrClass(info: InterfaceInfo | ClassInfo, knownTypeMap: Map<string, string>): string {
    const { title, weight, category, description, members } = info;
    let output = '';
    output += generateFrontMatter(title, weight);
    output += `\n\n# ${title}\n\n`;
    output += renderGenerationInfoShortcode(info);
    output += `${renderDescription(description, knownTypeMap)}\n\n`;
    output += `## Signature\n\n`;
    output += info.kind === 'interface' ? renderInterfaceSignature(info) : renderClassSignature(info);
    output += `## Members\n\n`;

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
            if (member.fullText === 'constructor') {
                type = `(${args}) => ${title}`;
            } else {
                type = `(${args}) => ${renderType(member.type, knownTypeMap)}`;
            }

        }
        output += `### ${member.name}\n\n`;
        output += `{{< member-info kind="${member.kind}" type="${type}" ${defaultParam}>}}\n\n`;
        output += `${renderDescription(member.description, knownTypeMap)}\n\n`;
    }

    return output;
}

/**
 * Generates a markdown code block string for the interface signature.
 */
function renderInterfaceSignature(interfaceInfo: InterfaceInfo): string {
    const { fullText, members } = interfaceInfo;
    let output = '';
    output += `\`\`\`TypeScript\n`;
    output += `interface ${fullText} {\n`;
    output += members.map(member => `  ${member.fullText}`).join(`\n`);
    output += `\n}\n`;
    output += `\`\`\`\n`;

    return output;
}

function renderClassSignature(classInfo: ClassInfo): string {
    const { fullText, members } = classInfo;
    let output = '';
    output += `\`\`\`TypeScript\n`;
    output += `class ${fullText} {\n`;
    output += members.map(member => {
        if (member.kind === 'method') {
            const args = member.parameters
                .map(p => {
                    return `${p.name}: ${p.type}`;
                })
                .join(', ');
            if (member.fullText === 'constructor') {
                return `  constructor(${args})`;
            } else {
                return `  ${member.fullText}(${args}) => ${member.type};`;
            }
        } else {
            return `  ${member.fullText}`;
        }
    }).join(`\n`);
    output += `\n}\n`;
    output += `\`\`\`\n`;

    return output;
}

/**
 * Render the type alias to a markdown string.
 */
function renderTypeAlias(typeAliasInfo: TypeAliasInfo, knownTypeMap: Map<string, string>): string {
    const { title, weight, description, type, fullText } = typeAliasInfo;
    let output = '';
    output += generateFrontMatter(title, weight);
    output += `\n\n# ${title}\n\n`;
    output += renderGenerationInfoShortcode(typeAliasInfo);
    output += `${renderDescription(description, knownTypeMap)}\n\n`;
    output += `## Signature\n\n`;
    output += `\`\`\`TypeScript\ntype ${fullText} = ${type};\n\`\`\``;

    return output;
}

function renderGenerationInfoShortcode(info: DeclarationInfo): string {
    return `{{< generation-info sourceFile="${info.sourceFile}" sourceLine="${info.sourceLine}">}}\n\n`;
}

/**
 * Extracts the "@docsCategory" value from the JSDoc comments if present.
 */
function getDocsCategory(statement: ValidDeclaration): string | undefined {
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
function renderType(type: string, knownTypeMap: TypeMap): string {
    let typeText = type
        .trim()
        // encode HTML entities
        .replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')
        // remove newlines
        .replace(/\n/g, ' ');

    for (const [key, val] of knownTypeMap) {
        const re = new RegExp(`\\b${key}\\b`, 'g');
        typeText = typeText.replace(re, `<a href='${docsUrl}/${val}/'>${key}</a>`);
    }
    return typeText;
}

/**
 * Replaces any `{@link Foo}` references in the description with hyperlinks.
 */
function renderDescription(description: string, knownTypeMap: TypeMap): string {
    for (const [key, val] of knownTypeMap) {
        const re = new RegExp(`{@link\\s*${key}}`, 'g');
        description = description.replace(re, `<a href='${docsUrl}/${val}/'>${key}</a>`);
    }
    return description;
}

/**
 * Reads the @docsWeight JSDoc tag from the interface.
 */
function getDeclarationWeight(statement: ValidDeclaration): number {
    let weight = 10;
    parseTags(statement, {
        docsWeight: tag => (weight = Number.parseInt(tag.comment || '10', 10)),
    });
    return weight;
}

/**
 * Reads the @description JSDoc tag from the interface.
 */
function getDeclarationDescription(statement: ValidDeclaration): string {
    let description = '';
    parseTags(statement, {
        description: tag => (description += tag.comment),
        example: tag => (description += formatExampleCode(tag.comment)),
    });
    return description;
}

/**
 * Cleans up a JSDoc "@example" block by removing leading whitespace and asterisk (TypeScript has an open issue
 * wherein the asterisks are not stripped as they should be, see https://github.com/Microsoft/TypeScript/issues/23517)
 */
function formatExampleCode(example: string = ''): string {
    return '\n\n*Example*\n\n' + example.replace(/\n\s+\*\s/g, '\n');
}

/**
 * Type guard for the types of statement which can ge processed by the doc generator.
 */
function isValidDeclaration(statement: ts.Statement): statement is ValidDeclaration {
    return (
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isClassDeclaration(statement)
    );
}
