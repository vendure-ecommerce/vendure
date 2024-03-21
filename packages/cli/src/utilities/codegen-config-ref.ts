import fs from 'fs-extra';
import path from 'path';
import {
    Directory,
    ObjectLiteralExpression,
    ObjectLiteralExpressionPropertyStructures,
    Project,
    PropertyAssignmentStructure,
    SourceFile,
    SyntaxKind,
} from 'ts-morph';

import { createFile, getTsMorphProject } from './ast-utils';

export class CodegenConfigRef {
    private readonly tempProject: Project;
    private readonly sourceFile: SourceFile;
    private configObject: ObjectLiteralExpression | undefined;
    constructor(rootDir: Directory) {
        this.tempProject = getTsMorphProject({ skipAddingFilesFromTsConfig: true });
        const codegenFilePath = path.join(rootDir.getPath(), 'codegen.ts');
        if (fs.existsSync(codegenFilePath)) {
            this.sourceFile = this.tempProject.addSourceFileAtPath(codegenFilePath);
        } else {
            this.sourceFile = createFile(
                this.tempProject,
                path.join(__dirname, 'templates/codegen.template.ts'),
            );
            this.sourceFile.move(path.join(rootDir.getPath(), 'codegen.ts'));
        }
    }

    addEntryToGeneratesObject(structure: PropertyAssignmentStructure) {
        const generatesProp = this.getConfigObject()
            .getProperty('generates')
            ?.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
        if (!generatesProp) {
            throw new Error('Could not find the generates property in the template codegen file');
        }
        if (generatesProp.getProperty(structure.name)) {
            return;
        }
        generatesProp.addProperty(structure).formatText();
    }

    getConfigObject() {
        if (this.configObject) {
            return this.configObject;
        }
        const codegenConfig = this.sourceFile
            .getVariableDeclaration('config')
            ?.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)[0];
        if (!codegenConfig) {
            throw new Error('Could not find the config variable in the template codegen file');
        }
        this.configObject = codegenConfig;
        return this.configObject;
    }

    save() {
        return this.tempProject.save();
    }
}
