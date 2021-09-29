import fs from 'fs';
import {
    buildClientSchema,
    GraphQLField,
    GraphQLInputObjectType,
    GraphQLNamedType,
    GraphQLObjectType,
    GraphQLType,
    GraphQLUnionType,
    isEnumType,
    isInputObjectType,
    isNamedType,
    isObjectType,
    isScalarType,
    isUnionType,
} from 'graphql';
import path from 'path';

import { deleteGeneratedDocs, generateFrontMatter } from './docgen-utils';

// tslint:disable:no-console

type TargetApi = 'shop' | 'admin';

const targetApi: TargetApi = getTargetApiFromArgs();

// The path to the introspection schema json file
const SCHEMA_FILE = path.join(__dirname, `../../schema-${targetApi}.json`);
// The absolute URL to the generated api docs section
const docsUrl = `/docs/graphql-api/${targetApi}/`;
// The directory in which the markdown files will be saved
const outputPath = path.join(__dirname, `../../docs/content/graphql-api/${targetApi}`);

const enum FileName {
    ENUM = 'enums',
    INPUT = 'input-types',
    MUTATION = 'mutations',
    QUERY = 'queries',
    OBJECT = 'object-types',
}

const schemaJson = fs.readFileSync(SCHEMA_FILE, 'utf8');
const parsed = JSON.parse(schemaJson);
const schema = buildClientSchema(parsed.data ? parsed.data : parsed);

deleteGeneratedDocs(outputPath);
generateGraphqlDocs(outputPath);

function generateGraphqlDocs(hugoOutputPath: string) {
    const timeStart = +new Date();
    let queriesOutput = generateFrontMatter('Queries', 1) + `\n\n# Queries\n\n`;
    let mutationsOutput = generateFrontMatter('Mutations', 2) + `\n\n# Mutations\n\n`;
    let objectTypesOutput = generateFrontMatter('Types', 3) + `\n\n# Types\n\n`;
    let inputTypesOutput = generateFrontMatter('Input Objects', 4) + `\n\n# Input Objects\n\n`;
    let enumsOutput = generateFrontMatter('Enums', 5) + `\n\n# Enums\n\n`;
    const sortByName = (a: { name: string }, b: { name: string }) => (a.name < b.name ? -1 : 1);
    const sortedTypes = Object.values(schema.getTypeMap()).sort(sortByName);
    for (const type of sortedTypes) {
        if (type.name.substring(0, 2) === '__') {
            // ignore internal types
            continue;
        }

        if (isObjectType(type)) {
            if (type.name === 'Query') {
                for (const field of Object.values(type.getFields()).sort(sortByName)) {
                    if (field.name === 'temp__') {
                        continue;
                    }
                    queriesOutput += `## ${field.name}\n`;
                    queriesOutput += renderDescription(field);
                    queriesOutput += renderFields([field], false) + '\n\n';
                }
            } else if (type.name === 'Mutation') {
                for (const field of Object.values(type.getFields()).sort(sortByName)) {
                    mutationsOutput += `## ${field.name}\n`;
                    mutationsOutput += renderDescription(field);
                    mutationsOutput += renderFields([field], false) + '\n\n';
                }
            } else {
                objectTypesOutput += `## ${type.name}\n\n`;
                objectTypesOutput += renderDescription(type);
                objectTypesOutput += renderFields(type);
                objectTypesOutput += `\n`;
            }
        }

        if (isEnumType(type)) {
            enumsOutput += `## ${type.name}\n\n`;
            enumsOutput += renderDescription(type) + '\n\n';
            enumsOutput += '{{% gql-enum-values %}}\n';
            for (const value of type.getValues()) {
                enumsOutput += value.description ? ` * *// ${value.description.trim()}*\n` : '';
                enumsOutput += ` * ${value.name}\n`;
            }
            enumsOutput += '{{% /gql-enum-values %}}\n';
            enumsOutput += '\n';
        }

        if (isScalarType(type)) {
            objectTypesOutput += `## ${type.name}\n\n`;
            objectTypesOutput += renderDescription(type);
        }

        if (isInputObjectType(type)) {
            inputTypesOutput += `## ${type.name}\n\n`;
            inputTypesOutput += renderDescription(type);
            inputTypesOutput += renderFields(type);
            inputTypesOutput += `\n`;
        }

        if (isUnionType(type)) {
            objectTypesOutput += `## ${type.name}\n\n`;
            objectTypesOutput += renderDescription(type);
            objectTypesOutput += renderUnion(type);
        }
    }

    fs.writeFileSync(path.join(hugoOutputPath, FileName.QUERY + '.md'), queriesOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.MUTATION + '.md'), mutationsOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.OBJECT + '.md'), objectTypesOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.INPUT + '.md'), inputTypesOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.ENUM + '.md'), enumsOutput);

    console.log(`Generated 5 GraphQL API docs in ${+new Date() - timeStart}ms`);
}

/**
 * Renders the type description if it exists.
 */
function renderDescription(type: { description?: string | null }): string {
    if (!type.description) {
        return '';
    }
    // Strip any JSDoc tags which may be used to annotate the generated
    // TS types.
    const stringsToStrip = [/@docsCategory\s+[^\n]+/g, /@description\s+/g];
    let result = type.description;
    for (const pattern of stringsToStrip) {
        result = result.replace(pattern, '');
    }
    return result + '\n\n';
}

function renderFields(
    typeOrFields: (GraphQLObjectType | GraphQLInputObjectType) | Array<GraphQLField<any, any>>,
    includeDescription = true,
): string {
    let output = '{{% gql-fields %}}\n';
    const fieldsArray: Array<GraphQLField<any, any>> = Array.isArray(typeOrFields)
        ? typeOrFields
        : Object.values(typeOrFields.getFields());
    for (const field of fieldsArray) {
        if (includeDescription) {
            output += field.description ? `* *// ${field.description.trim()}*\n` : '';
        }
        output += ` * ${renderFieldSignature(field)}\n`;
    }
    output += '{{% /gql-fields %}}\n\n';
    return output;
}

function renderUnion(type: GraphQLUnionType): string {
    const unionTypes = type
        .getTypes()
        .map(t => renderTypeAsLink(t))
        .join(' | ');
    let output = '{{% gql-fields %}}\n';
    output += `union ${type.name} = ${unionTypes}\n`;
    output += '{{% /gql-fields %}}\n\n';
    return output;
}

/**
 * Renders a field signature including any argument and output type
 */
function renderFieldSignature(field: GraphQLField<any, any>): string {
    let name = field.name;
    if (field.args && field.args.length) {
        name += `(${field.args.map(arg => arg.name + ': ' + renderTypeAsLink(arg.type)).join(', ')})`;
    }
    return `${name}: ${renderTypeAsLink(field.type)}`;
}

/**
 * Renders a type as a markdown link.
 */
function renderTypeAsLink(type: GraphQLType): string {
    const innerType = unwrapType(type);
    const fileName = isEnumType(innerType)
        ? FileName.ENUM
        : isInputObjectType(innerType)
        ? FileName.INPUT
        : FileName.OBJECT;
    const url = `${docsUrl}${fileName}#${innerType.name.toLowerCase()}`;
    return type.toString().replace(innerType.name, `[${innerType.name}](${url})`);
}

/**
 * Unwraps the inner type from a higher-order type, e.g. [Address!]! => Address
 */
function unwrapType(type: GraphQLType): GraphQLNamedType {
    if (isNamedType(type)) {
        return type;
    }
    let innerType = type;
    while (!isNamedType(innerType)) {
        innerType = innerType.ofType;
    }
    return innerType;
}

function getTargetApiFromArgs(): TargetApi {
    const apiArg = process.argv.find(arg => /--api=(shop|admin)/.test(arg));
    if (!apiArg) {
        console.error(`\nPlease specify which GraphQL API to generate docs for: --api=<shop|admin>\n`);
        process.exit(1);
        return null as never;
    }
    return apiArg === '--api=shop' ? 'shop' : 'admin';
}
