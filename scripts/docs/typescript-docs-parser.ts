import fs from 'fs';
import path from 'path';
import ts from 'typescript';

import { notNullOrUndefined } from '../../packages/common/src/shared-utils';

import {
    ClassInfo,
    InterfaceInfo,
    MemberInfo,
    MethodInfo,
    MethodParameterInfo,
    ParsedDeclaration,
    PropertyInfo,
    TypeAliasInfo,
    ValidDeclaration,
} from './typescript-docgen-types';

/**
 * Parses TypeScript source files into data structures which can then be rendered into
 * markdown for documentation.
 */
export class TypescriptDocsParser {

    /**
     * Parses the TypeScript files given by the filePaths array and returns the
     * parsed data structures ready for rendering.
     */
    parse(filePaths: string[]): ParsedDeclaration[] {
        const sourceFiles = filePaths.map(filePath => {
            return ts.createSourceFile(
                filePath,
                fs.readFileSync(filePath).toString(),
                ts.ScriptTarget.ES2015,
                true,
            );
        });

        const statements = this.getStatementsWithSourceLocation(sourceFiles);

        return statements
            .map(statement => {
                const info = this.parseDeclaration(statement.statement, statement.sourceFile, statement.sourceLine);
                return info;
            })
            .filter(notNullOrUndefined);
    }

    /**
     * Maps an array of parsed SourceFiles into statements, including a reference to the original file each statement
     * came from.
     */
    private getStatementsWithSourceLocation(
        sourceFiles: ts.SourceFile[],
    ): Array<{ statement: ts.Statement; sourceFile: string; sourceLine: number }> {
        return sourceFiles.reduce(
            (st, sf) => {
                const statementsWithSources = sf.statements.map(statement => {
                    const sourceFile = path.relative(path.join(__dirname, '..'), sf.fileName).replace(/\\/g, '/');
                    const sourceLine = sf.getLineAndCharacterOfPosition(statement.getStart()).line + 1;
                    return {statement, sourceFile, sourceLine};
                });
                return [...st, ...statementsWithSources];
            },
            [] as Array<{ statement: ts.Statement; sourceFile: string; sourceLine: number }>,
        );
    }

    /**
     * Parses an InterfaceDeclaration into a simple object which can be rendered into markdown.
     */
    private parseDeclaration(
        statement: ts.Statement,
        sourceFile: string,
        sourceLine: number,
    ): InterfaceInfo | TypeAliasInfo | ClassInfo | undefined {
        if (!this.isValidDeclaration(statement)) {
            return;
        }
        const category = this.getDocsCategory(statement);
        if (category === undefined) {
            return;
        }
        const title = statement.name ? statement.name.getText() : 'anonymous';
        const fullText = this.getDeclarationFullText(statement);
        const weight = this.getDeclarationWeight(statement);
        const description = this.getDeclarationDescription(statement);
        const normalizedTitle = this.kebabCase(title);
        const fileName = normalizedTitle === category ? '_index' : normalizedTitle;

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
                extends: this.getHeritageClauseText(statement, ts.SyntaxKind.ExtendsKeyword),
                members: this.parseMembers(statement.members),
            };
        } else if (ts.isTypeAliasDeclaration(statement)) {
            return {
                ...info,
                type: statement.type,
                kind: 'typeAlias',
                members: ts.isTypeLiteralNode(statement.type) ? this.parseMembers(statement.type.members) : undefined,
            };
        } else if (ts.isClassDeclaration(statement)) {
            return {
                ...info,
                kind: 'class',
                members: this.parseMembers(statement.members),
                extends: this.getHeritageClauseText(statement, ts.SyntaxKind.ExtendsKeyword),
                implements: this.getHeritageClauseText(statement, ts.SyntaxKind.ImplementsKeyword),
            };
        }
    }

    /**
     * Returns the text of any "extends" or "implements" clause of a class or interface.
     */
    private getHeritageClauseText(
        statement: ts.ClassDeclaration | ts.InterfaceDeclaration,
        kind: ts.SyntaxKind.ExtendsKeyword | ts.SyntaxKind.ImplementsKeyword,
    ): string | undefined {
        const {heritageClauses} = statement;
        if (!heritageClauses) {
            return;
        }
        const clause = heritageClauses.find(cl => cl.token === kind);
        if (!clause) {
            return;
        }
        return clause.getText();
    }

    /**
     * Returns the declaration name plus any type parameters.
     */
    private getDeclarationFullText(declaration: ValidDeclaration): string {
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
    private parseMembers(
        members: ts.NodeArray<ts.TypeElement | ts.ClassElement>,
    ): Array<PropertyInfo | MethodInfo> {
        const result: Array<PropertyInfo | MethodInfo> = [];

        for (const member of members) {
            const modifiers = member.modifiers ? member.modifiers.map(m => m.getText()) : [];
            const isPrivate = modifiers.includes('private');
            if (
                !isPrivate &&
                (ts.isPropertySignature(member) ||
                    ts.isMethodSignature(member) ||
                    ts.isPropertyDeclaration(member) ||
                    ts.isMethodDeclaration(member) ||
                    ts.isConstructorDeclaration(member))
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
                this.parseTags(member, {
                    description: tag => (description += tag.comment || ''),
                    example: tag => (description += this.formatExampleCode(tag.comment)),
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
     * Reads the @docsWeight JSDoc tag from the interface.
     */
    private getDeclarationWeight(statement: ValidDeclaration): number {
        let weight = 10;
        this.parseTags(statement, {
            docsWeight: tag => (weight = Number.parseInt(tag.comment || '10', 10)),
        });
        return weight;
    }

    /**
     * Reads the @description JSDoc tag from the interface.
     */
    private getDeclarationDescription(statement: ValidDeclaration): string {
        let description = '';
        this.parseTags(statement, {
            description: tag => (description += tag.comment),
            example: tag => (description += this.formatExampleCode(tag.comment)),
        });
        return description;
    }

    /**
     * Extracts the "@docsCategory" value from the JSDoc comments if present.
     */
    private getDocsCategory(statement: ValidDeclaration): string | undefined {
        let category: string | undefined;
        this.parseTags(statement, {
            docsCategory: tag => (category = tag.comment || ''),
        });
        return this.kebabCase(category);
    };

    /**
     * Type guard for the types of statement which can ge processed by the doc generator.
     */
    private isValidDeclaration(statement: ts.Statement): statement is ValidDeclaration {
        return (
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement) ||
            ts.isClassDeclaration(statement)
        );
    }

    /**
     * Parses the Node's JSDoc tags and invokes the supplied functions against any matching tag names.
     */
    private parseTags<T extends ts.Node>(
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
     * Cleans up a JSDoc "@example" block by removing leading whitespace and asterisk (TypeScript has an open issue
     * wherein the asterisks are not stripped as they should be, see https://github.com/Microsoft/TypeScript/issues/23517)
     */
    private formatExampleCode(example: string = ''): string {
        return '\n\n*Example*\n\n' + example.replace(/\n\s+\*\s/g, '\n');
    }

    private kebabCase<T extends string | undefined>(input: T): T {
        if (input == null) {
            return input;
        }
        return input.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase() as T;
    }

}
