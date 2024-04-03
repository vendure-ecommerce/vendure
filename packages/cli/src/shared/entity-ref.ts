import { ClassDeclaration, Node, SyntaxKind, Type } from 'ts-morph';

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

    getProps(): Array<{ name: string; type: Type; nullable: boolean }> {
        return this.classDeclaration.getProperties().map(prop => {
            const propType = prop.getType();
            const name = prop.getName();
            if (propType.isUnion()) {
                // get the non-null part of the union
                const nonNullType = propType.getUnionTypes().find(t => !t.isNull() && !t.isUndefined());
                if (!nonNullType) {
                    throw new Error('Could not find non-null type in union');
                }
                return { name, type: nonNullType, nullable: true };
            }
            return { name, type: propType, nullable: false };
        });
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
