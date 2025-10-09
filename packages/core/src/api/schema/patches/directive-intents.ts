import {
    DefinitionNode,
    DocumentNode,
    FieldDefinitionNode,
    InputObjectTypeDefinitionNode,
    InputObjectTypeExtensionNode,
    InputValueDefinitionNode,
    Kind,
    ObjectTypeDefinitionNode,
    ObjectTypeExtensionNode,
    parse,
} from 'graphql';

export type DirectiveIntent =
    | { kind: 'remove'; typeName: string; fieldName: string; isInput: boolean }
    | { kind: 'makeNullable'; typeName: string; fieldName: string; isInput: boolean };

type DefinitionWithFields =
    | InputObjectTypeDefinitionNode
    | InputObjectTypeExtensionNode
    | ObjectTypeDefinitionNode
    | ObjectTypeExtensionNode;

type FieldNode = FieldDefinitionNode | InputValueDefinitionNode;

function isInputDefinition(
    def: DefinitionNode,
): def is InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode {
    return def.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION || def.kind === Kind.INPUT_OBJECT_TYPE_EXTENSION;
}

function isObjectDefinition(
    def: DefinitionNode,
): def is ObjectTypeDefinitionNode | ObjectTypeExtensionNode {
    return def.kind === Kind.OBJECT_TYPE_DEFINITION || def.kind === Kind.OBJECT_TYPE_EXTENSION;
}

function getFields(def: DefinitionWithFields): readonly FieldNode[] {
    return def.fields ?? [];
}

function isDefinitionWithFields(def: DefinitionNode): def is DefinitionWithFields {
    return isInputDefinition(def) || isObjectDefinition(def);
}

export function collectDirectiveIntentsFromSDL(sdl: string): DirectiveIntent[] {
    if (!sdl || typeof sdl !== 'string') {
        return [];
    }
    const doc: DocumentNode = parse(sdl);
    const intents: DirectiveIntent[] = [];

    for (const def of doc.definitions) {
        if (!isDefinitionWithFields(def)) {
            continue;
        }

        const typeName = def.name?.value;
        if (!typeName) {
            continue;
        }

        const isInput = isInputDefinition(def);
        const fields = getFields(def);

        for (const field of fields) {
            const fieldName = field.name.value;
            const directives = field.directives ?? [];
            for (const directive of directives) {
                const name = directive.name.value;
                if (name === 'vendureRemove') {
                    intents.push({ kind: 'remove', typeName, fieldName, isInput });
                } else if (name === 'vendureMakeNullable') {
                    intents.push({ kind: 'makeNullable', typeName, fieldName, isInput });
                }
            }
        }
    }

    return intents;
}

export function combineDirectiveIntents(allSdls: string[]): DirectiveIntent[] {
    if (!Array.isArray(allSdls) || allSdls.length === 0) {
        return [];
    }
    const combined: DirectiveIntent[] = [];
    for (const sdl of allSdls) {
        const partial = collectDirectiveIntentsFromSDL(sdl);
        if (partial.length > 0) {
            combined.push(...partial);
        }
    }
    return combined;
}
