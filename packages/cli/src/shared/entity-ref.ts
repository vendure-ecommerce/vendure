import { ClassDeclaration, Node, SyntaxKind } from 'ts-morph';

export class EntityRef {
    constructor(public classDeclaration: ClassDeclaration) {}

    get name(): string {
        return this.classDeclaration.getName() as string;
    }

    get nameCamelCase(): string {
        return this.name.charAt(0).toLowerCase() + this.name.slice(1);
    }

    isTranslatable() {
        return this.classDeclaration.getImplements().some(i => i.getText() === 'Translatable');
    }

    isTranslation() {
        return this.classDeclaration.getImplements().some(i => i.getText().includes('Translation<'));
    }

    hasCustomFields() {
        return this.classDeclaration.getImplements().some(i => i.getText() === 'HasCustomFields');
    }

    getTranslationClass(): ClassDeclaration | undefined {
        if (!this.isTranslatable()) {
            return;
        }
        const translationsDecoratorArgs = this.classDeclaration
            .getProperty('translations')
            ?.getDecorator('OneToMany')
            ?.getArguments();

        if (translationsDecoratorArgs) {
            const typeFn = translationsDecoratorArgs[0];
            if (Node.isArrowFunction(typeFn)) {
                const translationClass = typeFn.getReturnType().getSymbolOrThrow().getDeclarations()[0];
                return translationClass as ClassDeclaration;
            }
        }
    }
}
