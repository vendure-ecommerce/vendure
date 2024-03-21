import { ClassDeclaration } from 'ts-morph';

import { AdminUiExtensionTypeName } from '../constants';

export class VendurePluginRef {
    constructor(public classDeclaration: ClassDeclaration) {}

    get name(): string {
        return this.classDeclaration.getName() as string;
    }

    getSourceFile() {
        return this.classDeclaration.getSourceFile();
    }

    getPluginDir() {
        return this.classDeclaration.getSourceFile().getDirectory();
    }

    hasUiExtensions(): boolean {
        return !!this.classDeclaration
            .getStaticProperties()
            .find(prop => prop.getType().getText() === AdminUiExtensionTypeName);
    }
}
