import path from 'path';
import ts from 'typescript';

import { PluginInfo } from './config-loader.js';

/**
 * Get the plugin info from the source file.
 */
export function getPluginInfo(sourceFile: ts.SourceFile): PluginInfo | undefined {
    const classDeclaration = sourceFile.statements.find(statement => {
        return (
            statement.kind === ts.SyntaxKind.ClassDeclaration &&
            statement.getText().includes('@VendurePlugin(')
        );
    });
    if (classDeclaration) {
        const identifier = classDeclaration.getChildren().find(child => {
            return child.kind === ts.SyntaxKind.Identifier;
        });
        const dashboardEntryPath = classDeclaration
            .getChildren()
            .map(child => {
                if (child.kind === ts.SyntaxKind.SyntaxList) {
                    const pluginDecorator = child.getChildren().find(_child => {
                        return _child.kind === ts.SyntaxKind.Decorator;
                    });
                    if (pluginDecorator) {
                        const callExpression = findFirstDescendantOfKind(
                            pluginDecorator,
                            ts.SyntaxKind.CallExpression,
                        );
                        if (callExpression) {
                            const objectLiteral = findFirstDescendantOfKind(
                                callExpression,
                                ts.SyntaxKind.ObjectLiteralExpression,
                            );
                            if (objectLiteral && ts.isObjectLiteralExpression(objectLiteral)) {
                                // Now find the specific 'dashboard' property
                                const dashboardProperty = objectLiteral.properties.find(
                                    prop =>
                                        ts.isPropertyAssignment(prop) && prop.name?.getText() === 'dashboard',
                                );

                                if (
                                    dashboardProperty &&
                                    ts.isPropertyAssignment(dashboardProperty) &&
                                    ts.isStringLiteral(dashboardProperty.initializer)
                                ) {
                                    const dashboardPath = dashboardProperty.initializer.text;
                                    return dashboardPath;
                                }
                            }
                        }
                    }
                }
            })
            .filter(Boolean)?.[0];
        if (identifier) {
            return {
                name: identifier.getText(),
                pluginPath: path.dirname(sourceFile.fileName),
                dashboardEntryPath,
            };
        }
    }
}

/**
 * Given the AST of a TypeScript file, finds the name of the variable exported as VendureConfig.
 */
export function findConfigExport(sourceFile: ts.SourceFile): string | undefined {
    let exportedSymbolName: string | undefined;

    function visit(node: ts.Node) {
        if (
            ts.isVariableStatement(node) &&
            node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
        ) {
            node.declarationList.declarations.forEach(declaration => {
                if (ts.isVariableDeclaration(declaration)) {
                    const typeNode = declaration.type;
                    if (typeNode && ts.isTypeReferenceNode(typeNode)) {
                        const typeName = typeNode.typeName;
                        if (ts.isIdentifier(typeName) && typeName.text === 'VendureConfig') {
                            if (ts.isIdentifier(declaration.name)) {
                                exportedSymbolName = declaration.name.text;
                            }
                        }
                    }
                }
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return exportedSymbolName;
}

function findFirstDescendantOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
    let foundNode: ts.Node | undefined;

    function visit(_node: ts.Node) {
        if (foundNode) {
            // Stop searching if we already found it
            return;
        }
        if (_node.kind === kind) {
            foundNode = _node;
            return;
        }
        // Recursively visit children
        ts.forEachChild(_node, visit);
    }

    // Start the traversal from the initial node's children
    ts.forEachChild(node, visit);
    return foundNode;
}
