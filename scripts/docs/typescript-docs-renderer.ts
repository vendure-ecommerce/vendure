// tslint:disable:no-console
import fs from 'fs-extra';
import path from 'path';
import { HeritageClause } from 'typescript';

import { assertNever } from '../../packages/common/src/shared-utils';

import { generateFrontMatter } from './docgen-utils';
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

export class TypescriptDocsRenderer {
    render(pages: DocsPage[], docsUrl: string, outputPath: string, typeMap: TypeMap): number {
        let generatedCount = 0;
        if (!fs.existsSync(outputPath)) {
            fs.mkdirs(outputPath);
        }

        for (const page of pages) {
            let markdown = '';
            markdown += generateFrontMatter(page.title, 10);
            markdown += `\n# ${page.title}\n`;
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
                // markdown += '{{< /declaration >}}\n';
            }

            const categoryDir = path.join(outputPath, page.category);
            const indexFile = path.join(categoryDir, '_index.md');
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirsSync(categoryDir);
            }
            if (!fs.existsSync(indexFile)) {
                const indexFileContent =
                    generateFrontMatter(page.category, 10, false) + `\n\n# ${page.category}`;
                fs.writeFileSync(indexFile, indexFileContent);
                generatedCount++;
            }

            fs.writeFileSync(path.join(categoryDir, page.fileName + '.md'), markdown);
            generatedCount++;
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
        output += `\n\n# ${title}\n\n`;
        output += this.renderGenerationInfoShortcode(info);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += `## Signature\n\n`;
        output +=
            info.kind === 'interface' ? this.renderInterfaceSignature(info) : this.renderClassSignature(info);
        if (info.extendsClause) {
            output += `## Extends\n\n`;
            output += `${this.renderHeritageClause(info.extendsClause, knownTypeMap, docsUrl)}\n`;
        }
        if (info.kind === 'class' && info.implementsClause) {
            output += `## Implements\n\n`;
            output += `${this.renderHeritageClause(info.implementsClause, knownTypeMap, docsUrl)}\n`;
        }
        if (info.members && info.members.length) {
            output += `## Members\n\n`;
            output += `${this.renderMembers(info, knownTypeMap, docsUrl)}\n`;
        }
        return output;
    }

    /**
     * Render the type alias to a markdown string.
     */
    private renderTypeAlias(typeAliasInfo: TypeAliasInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, type, fullText } = typeAliasInfo;
        let output = '';
        output += `\n\n# ${title}\n\n`;
        output += this.renderGenerationInfoShortcode(typeAliasInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += `## Signature\n\n`;
        output += this.renderTypeAliasSignature(typeAliasInfo);
        if (typeAliasInfo.members && typeAliasInfo.members.length) {
            output += `## Members\n\n`;
            output += `${this.renderMembers(typeAliasInfo, knownTypeMap, docsUrl)}\n`;
        }
        return output;
    }

    private renderEnum(enumInfo: EnumInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, fullText } = enumInfo;
        let output = '';
        output += `\n\n# ${title}\n\n`;
        output += this.renderGenerationInfoShortcode(enumInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += `## Signature\n\n`;
        output += this.renderEnumSignature(enumInfo);
        return output;
    }

    private renderFunction(functionInfo: FunctionInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, fullText, parameters } = functionInfo;
        let output = '';
        output += `\n\n# ${title}\n\n`;
        output += this.renderGenerationInfoShortcode(functionInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += `## Signature\n\n`;
        output += this.renderFunctionSignature(functionInfo, knownTypeMap);
        if (parameters.length) {
            output += `## Parameters\n\n`;
            output += this.renderFunctionParams(parameters, knownTypeMap, docsUrl);
        }
        return output;
    }

    private renderVariable(variableInfo: VariableInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, fullText } = variableInfo;
        let output = '';
        output += `\n\n# ${title}\n\n`;
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
        output += `\`\`\`TypeScript\n`;
        output += `interface ${fullText} `;
        if (interfaceInfo.extendsClause) {
            output += interfaceInfo.extendsClause.getText() + ' ';
        }
        output += `{\n`;
        output += members.map(member => `  ${member.fullText}`).join(`\n`);
        output += `\n}\n`;
        output += `\`\`\`\n`;

        return output;
    }

    private renderClassSignature(classInfo: ClassInfo): string {
        const { fullText, members } = classInfo;
        let output = '';
        output += `\`\`\`TypeScript\n`;
        output += `class ${fullText} `;
        if (classInfo.extendsClause) {
            output += classInfo.extendsClause.getText() + ' ';
        }
        if (classInfo.implementsClause) {
            output += classInfo.implementsClause.getText() + ' ';
        }
        output += `{\n`;
        const renderModifiers = (modifiers: string[]) => (modifiers.length ? modifiers.join(' ') + ' ' : '');
        output += members
            .map(member => {
                if (member.kind === 'method') {
                    const args = member.parameters.map(p => this.renderParameter(p, p.type)).join(', ');
                    if (member.fullText === 'constructor') {
                        return `  constructor(${args})`;
                    } else {
                        return `  ${renderModifiers(member.modifiers)}${member.fullText}(${args}) => ${
                            member.type
                        };`;
                    }
                } else {
                    return `  ${renderModifiers(member.modifiers)}${member.fullText}`;
                }
            })
            .join(`\n`);
        output += `\n}\n`;
        output += `\`\`\`\n`;

        return output;
    }

    private renderTypeAliasSignature(typeAliasInfo: TypeAliasInfo): string {
        const { fullText, members, type } = typeAliasInfo;
        let output = '';
        output += `\`\`\`TypeScript\n`;
        output += `type ${fullText} = `;
        if (members) {
            output += `{\n`;
            output += members.map(member => `  ${member.fullText}`).join(`\n`);
            output += `\n}\n`;
        } else {
            output += type.getText() + `\n`;
        }
        output += `\`\`\`\n`;
        return output;
    }

    private renderEnumSignature(enumInfo: EnumInfo): string {
        const { fullText, members } = enumInfo;
        let output = '';
        output += `\`\`\`TypeScript\n`;
        output += `enum ${fullText} `;
        if (members) {
            output += `{\n`;
            output += members
                .map(member => {
                    let line = member.description ? `  // ${member.description}\n` : '';
                    line += `  ${member.fullText}`;
                    return line;
                })
                .join(`\n`);
            output += `\n}\n`;
        }
        output += `\`\`\`\n`;
        return output;
    }

    private renderFunctionSignature(functionInfo: FunctionInfo, knownTypeMap: TypeMap): string {
        const { fullText, parameters, type } = functionInfo;
        const args = parameters.map(p => this.renderParameter(p, p.type)).join(', ');
        let output = '';
        output += `\`\`\`TypeScript\n`;
        output += `function ${fullText}(${args}): ${type ? type.getText() : 'void'}\n`;
        output += `\`\`\`\n`;
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
            output += `{{< member-info kind="parameter" type="${type}" >}}\n\n`;
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
            let type = '';
            if (member.kind === 'property') {
                type = this.renderType(member.type, knownTypeMap, docsUrl);
                defaultParam = member.defaultValue
                    ? `default="${this.renderType(member.defaultValue, knownTypeMap, docsUrl)}" `
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
            output += `### ${member.name}\n\n`;
            output += `{{< member-info kind="${[...member.modifiers, member.kind].join(
                ' ',
            )}" type="${type}" ${defaultParam} ${sinceParam}>}}\n\n`;
            output += `{{< member-description >}}${this.renderDescription(
                member.description,
                knownTypeMap,
                docsUrl,
            )}{{< /member-description >}}\n\n`;
        }
        return output;
    }

    private renderHeritageClause(clause: HeritageClause, knownTypeMap: TypeMap, docsUrl: string) {
        return (
            clause.types.map(t => ` * ${this.renderType(t.getText(), knownTypeMap, docsUrl)}`).join('\n') +
            '\n\n'
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
        return `{{< generation-info sourceFile="${sourceFile}" sourceLine="${info.sourceLine}" packageName="${info.packageName}"${sinceData}>}}\n\n`;
    }

    /**
     * This function takes a string representing a type (e.g. "Array<ShippingMethod>") and turns
     * and known types (e.g. "ShippingMethod") into hyperlinks.
     */
    private renderType(type: string, knownTypeMap: TypeMap, docsUrl: string): string {
        let typeText = type
            .trim()
            // encode HTML entities
            .replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')
            // remove newlines
            .replace(/\n/g, ' ');

        for (const [key, val] of knownTypeMap) {
            const re = new RegExp(`\\b${key}\\b`, 'g');
            const strippedIndex = val.replace(/\/_index$/, '');
            typeText = typeText.replace(re, `<a href='${docsUrl}/${strippedIndex}'>${key}</a>`);
        }
        return typeText;
    }

    /**
     * Replaces any `{@link Foo}` references in the description with hyperlinks.
     */
    private renderDescription(description: string, knownTypeMap: TypeMap, docsUrl: string): string {
        for (const [key, val] of knownTypeMap) {
            const re = new RegExp(`{@link\\s*${key}}`, 'g');
            description = description.replace(re, `<a href='${docsUrl}/${val}'>${key}</a>`);
        }
        return description;
    }
}
