// tslint:disable:no-console
import fs from 'fs-extra';
import klawSync from 'klaw-sync';
import path from 'path';
import ts from 'typescript';

import { assertNever } from '../../packages/common/src/shared-utils';

import { deleteGeneratedDocs, generateFrontMatter } from './docgen-utils';
import { ClassInfo, DeclarationInfo, InterfaceInfo, ParsedDeclaration, TypeAliasInfo, TypeMap } from './typescript-docgen-types';

export class TypescriptDocsRenderer {

    render(parsedDeclarations: ParsedDeclaration[], docsUrl: string, outputPath: string, typeMap: TypeMap): number {
        let generatedCount = 0;
        if (!fs.existsSync(outputPath)) {
            fs.mkdirs(outputPath);
        }
        for (const info of parsedDeclarations) {
            let markdown = '';
            switch (info.kind) {
                case 'interface':
                    markdown = this.renderInterfaceOrClass(info, typeMap, docsUrl);
                    break;
                case 'typeAlias':
                    markdown = this.renderTypeAlias(info, typeMap, docsUrl);
                    break;
                case 'class':
                    markdown = this.renderInterfaceOrClass(info, typeMap, docsUrl);
                    break;
                default:
                    assertNever(info);
            }

            const categoryDir = path.join(outputPath, info.category);
            const indexFile = path.join(categoryDir, '_index.md');
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirs(categoryDir);
            }
            if (!fs.existsSync(indexFile)) {
                const indexFileContent = generateFrontMatter(info.category, 10, false) + `\n\n# ${info.category}`;
                fs.writeFileSync(indexFile, indexFileContent);
                generatedCount++;
            }

            fs.writeFileSync(path.join(categoryDir, info.fileName + '.md'), markdown);
            generatedCount++;
        }
        return generatedCount;
    }

    /**
     * Render the interface to a markdown string.
     */
    private renderInterfaceOrClass(info: InterfaceInfo | ClassInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, category, description, members } = info;
        let output = '';
        output += generateFrontMatter(title, weight);
        output += `\n\n# ${title}\n\n`;
        output += this.renderGenerationInfoShortcode(info);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += `## Signature\n\n`;
        output += info.kind === 'interface' ? this.renderInterfaceSignature(info) : this.renderClassSignature(info);
        output += `## Members\n\n`;
        output += `${this.renderMembers(info, knownTypeMap, docsUrl)}\n`;
        return output;
    }

    /**
     * Render the type alias to a markdown string.
     */
    private renderTypeAlias(typeAliasInfo: TypeAliasInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { title, weight, description, type, fullText } = typeAliasInfo;
        let output = '';
        output += generateFrontMatter(title, weight);
        output += `\n\n# ${title}\n\n`;
        output += this.renderGenerationInfoShortcode(typeAliasInfo);
        output += `${this.renderDescription(description, knownTypeMap, docsUrl)}\n\n`;
        output += `## Signature\n\n`;
        output += this.renderTypeAliasSignature(typeAliasInfo);
        if (typeAliasInfo.members) {
            output += `## Members\n\n`;
            output += `${this.renderMembers(typeAliasInfo, knownTypeMap, docsUrl)}\n`;
        }
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
        if (interfaceInfo.extends) {
            output += interfaceInfo.extends + ' ';
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
        if (classInfo.extends) {
            output += classInfo.extends + ' ';
        }
        if (classInfo.implements) {
            output += classInfo.implements + ' ';
        }
        output += `{\n`;
        output += members
            .map(member => {
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

    private renderMembers(info: InterfaceInfo | ClassInfo | TypeAliasInfo, knownTypeMap: TypeMap, docsUrl: string): string {
        const { members, title } = info;
        let output = '';
        for (const member of members || []) {
            let defaultParam = '';
            let type = '';
            if (member.kind === 'property') {
                type = this.renderType(member.type, knownTypeMap, docsUrl);
                defaultParam = member.defaultValue
                    ? `default="${this.renderType(member.defaultValue, knownTypeMap, docsUrl)}" `
                    : '';
            } else {
                const args = member.parameters
                    .map(p => {
                        return `${p.name}: ${this.renderType(p.type, knownTypeMap, docsUrl)}`;
                    })
                    .join(', ');
                if (member.fullText === 'constructor') {
                    type = `(${args}) => ${title}`;
                } else {
                    type = `(${args}) => ${this.renderType(member.type, knownTypeMap, docsUrl)}`;
                }
            }
            output += `### ${member.name}\n\n`;
            output += `{{< member-info kind="${member.kind}" type="${type}" ${defaultParam}>}}\n\n`;
            output += `${this.renderDescription(member.description, knownTypeMap, docsUrl)}\n\n`;
        }
        return output;
    }

    private renderGenerationInfoShortcode(info: DeclarationInfo): string {
        return `{{< generation-info sourceFile="${info.sourceFile}" sourceLine="${info.sourceLine}">}}\n\n`;
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
            typeText = typeText.replace(re, `<a href='${docsUrl}/${val}/'>${key}</a>`);
        }
        return typeText;
    }

    /**
     * Replaces any `{@link Foo}` references in the description with hyperlinks.
     */
    private renderDescription(description: string, knownTypeMap: TypeMap, docsUrl: string): string {
        for (const [key, val] of knownTypeMap) {
            const re = new RegExp(`{@link\\s*${key}}`, 'g');
            description = description.replace(re, `<a href='${docsUrl}/${val}/'>${key}</a>`);
        }
        return description;
    }

}
