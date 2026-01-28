/* eslint-disable no-console */
import fs from 'fs-extra';
import path from 'path';
import { HeritageClause } from 'typescript';

import { assertNever } from '../../packages/common/src/shared-utils';

import { generateFrontMatter, titleCase } from './docgen-utils';
import {
    ClassInfo,
    DeclarationInfo,
    DocsPage,
    EnumInfo,
    FunctionInfo,
    InterfaceInfo,
    MethodParameterInfo,
    TypeAliasInfo,
    TypeMap,
    VariableInfo,
} from './typescript-docgen-types';

const INDENT = '    ';

export class TypescriptDocsRenderer {
    render(pages: DocsPage[], docsUrl: string, outputPath: string, typeMap: TypeMap): number {
        let generatedCount = 0;
        if (!fs.existsSync(outputPath)) {
            fs.ensureDirSync(outputPath);
        }

        // Extract the section base path (e.g., 'typescript-api' from '.../reference/typescript-api')
        const referenceIndex = outputPath.indexOf('/reference/');
        const sectionBasePath = referenceIndex !== -1
            ? outputPath.slice(referenceIndex + '/reference/'.length)
            : '';

        // Build a map of parent category paths to their direct child categories
        const categoryChildren = new Map<string, Set<string>>();
        // Also track direct children of the section root (for sections like 'admin-ui-api', 'dashboard')
        const sectionRootChildren = new Set<string>();

        for (const page of pages) {
            // Track the first category as a child of the section root
            if (page.category.length > 0) {
                sectionRootChildren.add(page.category[0]);
            }
            // Track nested category relationships
            for (let i = 0; i < page.category.length - 1; i++) {
                const parentPath = page.category.slice(0, i + 1).join('/');
                const childCategory = page.category[i + 1];
                if (!categoryChildren.has(parentPath)) {
                    categoryChildren.set(parentPath, new Set());
                }
                categoryChildren.get(parentPath)!.add(childCategory);
            }
        }

        for (const page of pages) {
            let markdown = '';
            markdown += generateFrontMatter(page.title);
            const declarationsByWeight = page.declarations.sort((a, b) => a.weight - b.weight);
            for (const info of declarationsByWeight) {
                switch (info.kind) {
                    case 'interface':
                        markdown += this.renderInterfaceOrClass(info, typeMap, docsUrl);
                        break;
                    case 'typeAlias':
                        markdown += this.renderTypeAlias(info, typeMap, docsUrl);
                        break;
                    case 'class':
                        markdown += this.renderInterfaceOrClass(info, typeMap, docsUrl);
                        break;
                    case 'enum':
                        markdown += this.renderEnum(info, typeMap, docsUrl);
                        break;
                    case 'function':
                        markdown += this.renderFunction(info, typeMap, docsUrl);
                        break;
                    case 'variable':
                        markdown += this.renderVariable(info, typeMap, docsUrl);
                        break;
                    default:
                        assertNever(info);
                }
            }

            const categoryDir = path.join(outputPath, ...page.category);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirsSync(categoryDir);
            }
            const pathParts: string[] = [];
            for (const subCategory of page.category) {
                pathParts.push(subCategory);
                const indexFile = path.join(outputPath, ...pathParts, 'index.mdx');
                const exists = fs.existsSync(indexFile);
                const existingContent = exists ? fs.readFileSync(indexFile).toString() : '';
                const isGenerated = existingContent.includes('generated: true');
                const hasCustomContent = existingContent.includes('isDefaultIndex: false');

                // Skip files with custom content
                if (hasCustomContent) {
                    continue;
                }

                const categoryPath = pathParts.join('/');
                const children = categoryChildren.get(categoryPath);

                // Collect existing LinkCards from the file if it exists
                const existingLinkCards = new Set<string>();
                if (exists && isGenerated) {
                    const linkCardRegex = /<LinkCard href="([^"]+)"/g;
                    let match;
                    while ((match = linkCardRegex.exec(existingContent)) !== null) {
                        existingLinkCards.add(match[1]);
                    }
                }

                // Build set of new LinkCards
                const newLinkCards = new Set<string>();
                if (children && children.size > 0) {
                    for (const child of children) {
                        const basePath = sectionBasePath ? `${sectionBasePath}/` : '';
                        const absolutePath = `/reference/${basePath}${categoryPath}/${child}`;
                        newLinkCards.add(absolutePath);
                    }
                }

                // Merge and check if we need to write
                const allLinkCards = new Set([...existingLinkCards, ...newLinkCards]);
                const hasNewCards = newLinkCards.size > 0 &&
                    [...newLinkCards].some(card => !existingLinkCards.has(card));

                if (!exists || hasNewCards) {
                    let indexFileContent = generateFrontMatter(subCategory, true);

                    if (allLinkCards.size > 0) {
                        indexFileContent += '\n';
                        const sortedCards = Array.from(allLinkCards).sort();
                        for (const href of sortedCards) {
                            // Extract child name from href for title
                            const childName = href.split('/').pop() || '';
                            const title = titleCase(childName.replace(/-/g, ' '));
                            indexFileContent += `<LinkCard href="${href}" title="${title}" />\n`;
                        }
                    }

                    fs.writeFileSync(indexFile, indexFileContent);
                    if (!exists) {
                        generatedCount++;
                    }
                }
            }

            fs.writeFileSync(path.join(categoryDir, page.fileName + '.mdx'), markdown);
            generatedCount++;
        }

        // Generate index file for the section root (e.g., admin-ui-api/index.mdx, dashboard/index.mdx)
        if (sectionBasePath && sectionRootChildren.size > 0) {
            const sectionIndexFile = path.join(outputPath, 'index.mdx');
            const exists = fs.existsSync(sectionIndexFile);
            const existingContent = exists ? fs.readFileSync(sectionIndexFile).toString() : '';
            const isGenerated = existingContent.includes('generated: true');
            const hasCustomContent = existingContent.includes('isDefaultIndex: false');

            if (!hasCustomContent) {
                // Collect existing LinkCards
                const existingLinkCards = new Set<string>();
                if (exists && isGenerated) {
                    const linkCardRegex = /<LinkCard href="([^"]+)"/g;
                    let match;
                    while ((match = linkCardRegex.exec(existingContent)) !== null) {
                        existingLinkCards.add(match[1]);
                    }
                }

                // Build new LinkCards
                const newLinkCards = new Set<string>();
                for (const child of sectionRootChildren) {
                    const absolutePath = `/reference/${sectionBasePath}/${child}`;
                    newLinkCards.add(absolutePath);
                }

                // Merge and check if update needed
                const allLinkCards = new Set([...existingLinkCards, ...newLinkCards]);
                const hasNewCards = [...newLinkCards].some(card => !existingLinkCards.has(card));

                if (!exists || hasNewCards) {
                    const sectionTitle = titleCase(sectionBasePath.replace(/-/g, ' '));
                    let indexFileContent = generateFrontMatter(sectionTitle, true);

                    indexFileContent += '\n';
                    const sortedCards = Array.from(allLinkCards).sort();
                    for (const href of sortedCards) {
                        const childName = href.split('/').pop() || '';
                        const title = titleCase(childName.replace(/-/g, ' '));
                        indexFileContent += `<LinkCard href="${href}" title="${title}" />\n`;
                    }

                    fs.writeFileSync(sectionIndexFile, indexFileContent);
                    if (!exists) {
                        generatedCount++;
                    }
                }
            }
        }

        return generatedCount;
    }

    /**
     * Render the interface to a markdown string.
     */
    private renderInterfaceOrClass(
        info: InterfaceInfo | ClassInfo,
        knownTypeMap: TypeMap,
        docsUrl: string,
    ): string {
        const { title, weight, category, description, members } = info;
        let output = '';
        output += this.renderGenerationInfoShortcode(info);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output +=
            info.kind === 'interface' ? this.renderInterfaceSignature(info) : this.renderClassSignature(info);
        if (info.extendsClause) {
            output += '* Extends: ';
            output += `${this.renderHeritageClause(info.extendsClause, knownTypeMap, docsUrl)}\n`;
        }
        if (info.kind === 'class' && info.implementsClause) {
            output += '* Implements: ';
            output += `${this.renderHeritageClause(info.implementsClause, knownTypeMap, docsUrl)}\n`;
        }
        if (info.members && info.members.length) {
            output += '\n<div className="members-wrapper">\n';
            output += `${this.renderMembers(info, knownTypeMap, docsUrl)}\n`;
            output += '\n\n</div>\n';
        }
        return output;
    }

    /**
     * Render the type alias to a markdown string.
     */
    private renderTypeAlias(typeAliasInfo: TypeAliasInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, type, fullText } = typeAliasInfo;
        let output = '';
        output += this.renderGenerationInfoShortcode(typeAliasInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += this.renderTypeAliasSignature(typeAliasInfo);
        if (typeAliasInfo.members && typeAliasInfo.members.length) {
            output += '\n<div className="members-wrapper">\n';
            output += `${this.renderMembers(typeAliasInfo, knownTypeMap, docsUrl)}\n`;
            output += '\n\n</div>\n';
        }
        return output;
    }

    private renderEnum(enumInfo: EnumInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, fullText } = enumInfo;
        let output = '';
        output += this.renderGenerationInfoShortcode(enumInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += this.renderEnumSignature(enumInfo);
        return output;
    }

    private renderFunction(functionInfo: FunctionInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, fullText, parameters } = functionInfo;
        let output = '';
        output += this.renderGenerationInfoShortcode(functionInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += this.renderFunctionSignature(functionInfo, knownTypeMap);
        if (parameters.length) {
            output += 'Parameters\n\n';
            output += this.renderFunctionParams(parameters, knownTypeMap, docsUrl);
        }
        return output;
    }

    private renderVariable(variableInfo: VariableInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, fullText } = variableInfo;
        let output = '';
        output += this.renderGenerationInfoShortcode(variableInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        return output;
    }

    /**
     * Generates a markdown code block string for the interface signature.
     */
    private renderInterfaceSignature(interfaceInfo: InterfaceInfo): string {
        const { fullText, members } = interfaceInfo;
        let output = '';
        output += '```ts title="Signature"\n';
        output += `interface ${fullText} `;
        if (interfaceInfo.extendsClause) {
            output += interfaceInfo.extendsClause.getText() + ' ';
        }
        output += '{\n';
        output += members.map(member => `${INDENT}${member.fullText}`).join('\n');
        output += '\n}\n';
        output += '```\n';

        return output;
    }

    private renderClassSignature(classInfo: ClassInfo): string {
        const { fullText, members } = classInfo;
        let output = '';
        output += '```ts title="Signature"\n';
        output += `class ${fullText} `;
        if (classInfo.extendsClause) {
            output += classInfo.extendsClause.getText() + ' ';
        }
        if (classInfo.implementsClause) {
            output += classInfo.implementsClause.getText() + ' ';
        }
        output += '{\n';
        const renderModifiers = (modifiers: string[]) => (modifiers.length ? modifiers.join(' ') + ' ' : '');
        output += members
            .map(member => {
                if (member.kind === 'method') {
                    const args = member.parameters.map(p => this.renderParameter(p, p.type)).join(', ');
                    if (member.fullText === 'constructor') {
                        return `${INDENT}constructor(${args})`;
                    } else {
                        return `${INDENT}${member.fullText}(${args}) => ${member.type};`;
                    }
                } else {
                    return `${INDENT}${member.fullText}`;
                }
            })
            .join('\n');
        output += '\n}\n';
        output += '```\n';

        return output;
    }

    private renderTypeAliasSignature(typeAliasInfo: TypeAliasInfo): string {
        const { fullText, members, type } = typeAliasInfo;
        let output = '';
        output += '```ts title="Signature"\n';
        output += `type ${fullText} = `;
        if (members) {
            output += '{\n';
            output += members.map(member => `${INDENT}${member.fullText}`).join('\n');
            output += '\n}\n';
        } else {
            output += type.getText() + '\n';
        }
        output += '```\n';
        return output;
    }

    private renderEnumSignature(enumInfo: EnumInfo): string {
        const { fullText, members } = enumInfo;
        let output = '';
        output += '```ts title="Signature"\n';
        output += `enum ${fullText} `;
        if (members) {
            output += '{\n';
            output += members
                .map(member => {
                    let line = member.description ? `${INDENT}// ${member.description}\n` : '';
                    line += `${INDENT}${member.fullText}`;
                    return line;
                })
                .join('\n');
            output += '\n}\n';
        }
        output += '```\n';
        return output;
    }

    private renderFunctionSignature(functionInfo: FunctionInfo, knownTypeMap: TypeMap): string {
        const { fullText, parameters, type } = functionInfo;
        const args = parameters.map(p => this.renderParameter(p, p.type)).join(', ');
        let output = '';
        output += '```ts title="Signature"\n';
        output += `function ${fullText}(${args}): ${type ? type.getText() : 'void'}\n`;
        output += '```\n';
        return output;
    }

    private renderFunctionParams(
        params: MethodParameterInfo[],
        knownTypeMap: TypeMap,
        docsUrl: string,
    ): string {
        let output = '';
        for (const param of params) {
            const type = this.renderType(param.type, knownTypeMap, docsUrl);
            output += `### ${param.name}\n\n`;
            output += `<MemberInfo kind="parameter" type={\`${type}\`} />\n\n`;
        }
        return output;
    }

    private renderMembers(
        info: InterfaceInfo | ClassInfo | TypeAliasInfo | EnumInfo,
        knownTypeMap: TypeMap,
        docsUrl: string,
    ): string {
        const { members, title } = info;
        let output = '';
        for (const member of members || []) {
            let defaultParam = '';
            let sinceParam = '';
            let experimentalParam = '';
            let type = '';
            if (member.kind === 'property') {
                type = this.renderType(member.type, knownTypeMap, docsUrl);
                defaultParam = member.defaultValue
                    ? `default={\`${this.renderType(member.defaultValue, knownTypeMap, docsUrl)}\`} `
                    : '';
            } else {
                const args = member.parameters
                    .map(p => this.renderParameter(p, this.renderType(p.type, knownTypeMap, docsUrl)))
                    .join(', ');
                if (member.fullText === 'constructor') {
                    type = `(${args}) => ${title}`;
                } else {
                    type = `(${args}) => ${this.renderType(member.type, knownTypeMap, docsUrl)}`;
                }
            }
            if (member.since) {
                sinceParam = `since="${member.since}" `;
            }
            if (member.experimental) {
                experimentalParam = 'experimental="true"';
            }
            output += `\n### ${member.name}\n\n`;
            output += `<MemberInfo kind="${[member.kind].join(
                ' ',
            )}" type={\`${type}\`} ${defaultParam} ${sinceParam}${experimentalParam} />\n\n`;
            output += this.renderDescription(member.description, knownTypeMap, docsUrl);
        }
        return output;
    }

    private renderHeritageClause(clause: HeritageClause, knownTypeMap: TypeMap, docsUrl: string) {
        return (
            clause.types
                .map(t => this.renderHeritageType(t.getText(), knownTypeMap, docsUrl))
                .join(', ') + '\n\n'
        );
    }

    private renderParameter(p: MethodParameterInfo, typeString: string): string {
        return `${p.name}${p.optional ? '?' : ''}: ${typeString}${
            p.initializer ? ` = ${p.initializer}` : ''
        }`;
    }

    private renderGenerationInfoShortcode(info: DeclarationInfo): string {
        const sourceFile = info.sourceFile.replace(/^\.\.\//, '');
        let sinceData = '';
        if (info.since) {
            sinceData = ` since="${info.since}"`;
        }
        let experimental = '';
        if (info.experimental) {
            experimental = ' experimental="true"';
        }
        return `<GenerationInfo sourceFile="${sourceFile}" sourceLine="${info.sourceLine}" packageName="${info.packageName}"${sinceData}${experimental} />\n\n`;
    }

    /**
     * This function takes a string representing a type (e.g. "Array<ShippingMethod>") and turns
     * known types (e.g. "ShippingMethod") into hyperlinks, while wrapping generic syntax in backticks
     * to prevent MDX from interpreting them as JSX.
     */
    private renderType(type: string, knownTypeMap: TypeMap, docsUrl: string): string {
        const typeText = type
            .trim()
            // encode HTML entities
            .replace(/[\u00A0-\u9999\&]/gim, i => '&#' + i.charCodeAt(0) + ';')
            // remove newlines
            .replace(/\n/g, ' ');

        // Sort known types by length (longest first) to avoid partial matches
        const sortedTypes = [...knownTypeMap.entries()].sort((a, b) => b[0].length - a[0].length);

        let result = '';
        let remaining = typeText;

        while (remaining.length > 0) {
            // Try to match a known type at the current position
            let matched = false;
            for (const [key, val] of sortedTypes) {
                const re = new RegExp(`^(${key})\\b`);
                const match = remaining.match(re);
                if (match) {
                    const strippedIndex = val.replace(/\/_index$/, '');
                    result += `<a href='${docsUrl}/${strippedIndex}'>${key}</a>`;
                    remaining = remaining.slice(match[0].length);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Find the next known type in the remaining string
                let nextTypeIndex = remaining.length;
                for (const [key] of sortedTypes) {
                    const re = new RegExp(`\\b(${key})\\b`);
                    const match = remaining.match(re);
                    if (match && match.index !== undefined && match.index > 0 && match.index < nextTypeIndex) {
                        nextTypeIndex = match.index;
                    }
                }

                // Extract the non-type part (syntax like <, >, [], commas, etc.)
                const nonTypePart = remaining.slice(0, nextTypeIndex);
                // Angle brackets inside JS template literals in JSX don't need escaping
                result += nonTypePart;
                remaining = remaining.slice(nextTypeIndex);
            }
        }

        return result;
    }

    /**
     * Renders a heritage clause type (extends/implements) with DocsLink and backticks.
     * Processes the type string piece by piece to correctly handle nested generics.
     */
    private renderHeritageType(type: string, knownTypeMap: TypeMap, docsUrl: string): string {
        const typeText = type
            .trim()
            // encode HTML entities
            .replace(/[\u00A0-\u9999\&]/gim, i => '&#' + i.charCodeAt(0) + ';')
            // remove newlines
            .replace(/\n/g, ' ');

        // Sort known types by length (longest first) to avoid partial matches
        const sortedTypes = [...knownTypeMap.entries()].sort((a, b) => b[0].length - a[0].length);

        let result = '';
        let remaining = typeText;

        while (remaining.length > 0) {
            // Try to match a known type at the current position
            let matched = false;
            for (const [key, val] of sortedTypes) {
                const re = new RegExp(`^(${key})\\b`);
                const match = remaining.match(re);
                if (match) {
                    const strippedIndex = val.replace(/\/_index$/, '');
                    result += `[\`${key}\`](${docsUrl}/${strippedIndex})`;
                    remaining = remaining.slice(match[0].length);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Find the next known type in the remaining string
                let nextTypeIndex = remaining.length;
                for (const [key] of sortedTypes) {
                    const re = new RegExp(`\\b(${key})\\b`);
                    const match = remaining.match(re);
                    if (match && match.index !== undefined && match.index > 0 && match.index < nextTypeIndex) {
                        nextTypeIndex = match.index;
                    }
                }

                // Extract the non-type part (syntax like <, >, [], commas, etc.)
                const nonTypePart = remaining.slice(0, nextTypeIndex);
                // Wrap in backticks if it contains angle brackets to prevent MDX parsing issues
                // (heritage clauses are rendered directly in markdown text, not inside JSX attributes)
                if (nonTypePart.includes('<') || nonTypePart.includes('>')) {
                    result += '`' + nonTypePart + '`';
                } else {
                    result += nonTypePart;
                }
                remaining = remaining.slice(nextTypeIndex);
            }
        }

        return result;
    }

    /**
     * Replaces any `{@link Foo}` references in the description with hyperlinks.
     */
    private renderDescription(description: string, knownTypeMap: TypeMap, docsUrl: string): string {
        for (const [key, val] of knownTypeMap) {
            const re = new RegExp(`{@link\\s*${key}}`, 'g');
            description = description.replace(re, `[${key}](${docsUrl}/${val})`);
        }
        // Escape any remaining {@link ...} references that weren't matched by known types
        // Convert them to inline code to prevent MDX parsing issues with { }
        description = description.replace(/\{@link\s*(\S+)\}/g, '`$1`');
        return description;
    }
}
