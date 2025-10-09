import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
} from 'graphql/index.js';
import { mapSchema, MapperKind } from '@graphql-tools/utils';

import { DirectiveIntent } from './directive-intents';

type IntentLookups = {
    removeInput: Map<string, Set<string>>;
    removeObject: Map<string, Set<string>>;
    nullableInput: Map<string, Set<string>>;
    nullableObject: Map<string, Set<string>>;
    hasAnyInputOps: boolean;
    hasAnyObjectOps: boolean;
};

function buildLookups(intents: DirectiveIntent[]): IntentLookups {
    const removeInput = new Map<string, Set<string>>();
    const removeObject = new Map<string, Set<string>>();
    const nullableInput = new Map<string, Set<string>>();
    const nullableObject = new Map<string, Set<string>>();

    for (const intent of intents) {
        const target = intent.isInput
            ? intent.kind === 'remove'
                ? removeInput
                : nullableInput
            : intent.kind === 'remove'
              ? removeObject
              : nullableObject;

        let set = target.get(intent.typeName);
        if (!set) {
            set = new Set<string>();
            target.set(intent.typeName, set);
        }
        set.add(intent.fieldName);
    }

    const hasAnyInputOps = removeInput.size > 0 || nullableInput.size > 0;
    const hasAnyObjectOps = removeObject.size > 0 || nullableObject.size > 0;

    return { removeInput, removeObject, nullableInput, nullableObject, hasAnyInputOps, hasAnyObjectOps };
}

export function applyDirectiveIntents(schema: GraphQLSchema, intents: DirectiveIntent[]): GraphQLSchema {
    if (!intents || intents.length === 0) {
        return schema;
    }

    const lookups = buildLookups(intents);

    if (!lookups.hasAnyInputOps && !lookups.hasAnyObjectOps) {
        return schema;
    }

    const mapped = mapSchema(schema as any, {
        [MapperKind.INPUT_OBJECT_TYPE]: (type: any) => {
            if (!lookups.hasAnyInputOps) {
                return type;
            }

            const typeName = type.name;
            const removeSet = lookups.removeInput.get(typeName);
            const nullableSet = lookups.nullableInput.get(typeName);

            if (!removeSet && !nullableSet) {
                return type;
            }

            const config = type.toConfig();
            const originalFields =
                typeof config.fields === 'function' ? config.fields() : config.fields;
            const fieldConfig: Record<string, any> = { ...originalFields };

            if (removeSet) {
                for (const fieldName of removeSet) {
                    if (fieldConfig[fieldName]) {
                        delete fieldConfig[fieldName];
                    }
                }
            }

            if (nullableSet) {
                for (const fieldName of nullableSet) {
                    const field = fieldConfig[fieldName];
                    if (field && field.type instanceof GraphQLNonNull) {
                        fieldConfig[fieldName] = { ...field, type: field.type.ofType };
                    }
                }
            }

            return new GraphQLInputObjectType({
                ...(config as any),
                fields: () => fieldConfig,
            });
        },

        [MapperKind.OBJECT_TYPE]: (type: any) => {
            if (!lookups.hasAnyObjectOps) {
                return type;
            }

            const typeName = type.name;
            const removeSet = lookups.removeObject.get(typeName);
            const nullableSet = lookups.nullableObject.get(typeName);

            if (!removeSet && !nullableSet) {
                return type;
            }

            const config = type.toConfig();
            const originalFields =
                typeof config.fields === 'function' ? config.fields() : config.fields;
            const fieldConfig: Record<string, any> = { ...originalFields };

            if (removeSet) {
                for (const fieldName of removeSet) {
                    if (fieldConfig[fieldName]) {
                        delete fieldConfig[fieldName];
                    }
                }
            }

            if (nullableSet) {
                for (const fieldName of nullableSet) {
                    const field = fieldConfig[fieldName];
                    if (field && field.type instanceof GraphQLNonNull) {
                        fieldConfig[fieldName] = { ...field, type: field.type.ofType };
                    }
                }
            }

            return new GraphQLObjectType({
                ...(config as any),
                fields: () => fieldConfig,
            });
        },
    });

    return mapped as unknown as GraphQLSchema;
}
