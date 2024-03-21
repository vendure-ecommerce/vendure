import fs from 'fs-extra';
import path from 'node:path';
import {
    Node,
    ObjectLiteralExpression,
    Project,
    SourceFile,
    SyntaxKind,
    VariableDeclaration,
} from 'ts-morph';

export class VendureConfigRef {
    readonly sourceFile: SourceFile;
    readonly configObject: ObjectLiteralExpression;

    constructor(project: Project, options: { checkFileName?: boolean } = {}) {
        const checkFileName = options.checkFileName ?? true;

        function isVendureConfigVariableDeclaration(v: VariableDeclaration) {
            return v.getType().getText(v) === 'VendureConfig';
        }

        function getVendureConfigSourceFile(sourceFiles: SourceFile[]) {
            return sourceFiles.find(sf => {
                return (
                    (checkFileName ? sf.getFilePath().endsWith('vendure-config.ts') : true) &&
                    sf.getVariableDeclarations().find(isVendureConfigVariableDeclaration)
                );
            });
        }

        function findAndAddVendureConfigToProject() {
            // If the project does not contain a vendure-config.ts file, we'll look for a vendure-config.ts file
            // in the src directory.
            const srcDir = project.getDirectory('src');
            if (srcDir) {
                const srcDirPath = srcDir.getPath();
                const srcFiles = fs.readdirSync(srcDirPath);

                const filePath = srcFiles.find(file => file.includes('vendure-config.ts'));
                if (filePath) {
                    project.addSourceFileAtPath(path.join(srcDirPath, filePath));
                }
            }
        }

        let vendureConfigFile = getVendureConfigSourceFile(project.getSourceFiles());
        if (!vendureConfigFile) {
            findAndAddVendureConfigToProject();
            vendureConfigFile = getVendureConfigSourceFile(project.getSourceFiles());
        }
        if (!vendureConfigFile) {
            throw new Error('Could not find the VendureConfig declaration in your project.');
        }
        this.sourceFile = vendureConfigFile;
        this.configObject = vendureConfigFile
            ?.getVariableDeclarations()
            .find(isVendureConfigVariableDeclaration)
            ?.getChildren()
            .find(Node.isObjectLiteralExpression) as ObjectLiteralExpression;
    }

    getPluginsArray() {
        return this.configObject
            .getProperty('plugins')
            ?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    }

    addToPluginsArray(text: string) {
        this.getPluginsArray()?.addElement(text).formatText();
    }
}
