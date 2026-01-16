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

/* eslint-disable no-console */

type TargetApi = 'shop' | 'admin';

const targetApi: TargetApi = getTargetApiFromArgs();

// The path to the introspection schema json file
const SCHEMA_FILE = path.join(__dirname, `../../schema-${targetApi}.json`);
// The absolute URL to the generated api docs section
const docsUrl = `/reference/graphql-api/${targetApi}/`;
// The directory in which the markdown files will be saved
const outputPath = path.join(__dirname, `../../docs/docs/reference/graphql-api/${targetApi}`);

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
    let queriesOutput = generateFrontMatter('Queries') + '\n\n';
    let mutationsOutput = generateFrontMatter('Mutations') + '\n\n';
    let objectTypesOutput = generateFrontMatter('Types') + '\n\n';
    let inputTypesOutput = generateFrontMatter('Input Objects') + '\n\n';
    let enumsOutput = generateFrontMatter('Enums') + '\n\n';
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
                    queriesOutput += `\n## ${field.name}\n`;
                    queriesOutput += `<div class="graphql-code-block">\n`;
                    queriesOutput += renderDescription(field, 'multi', true);
                    queriesOutput += codeLine(`type ${identifier('Query')} &#123;`, ['top-level']);
                    queriesOutput += renderFields([field], false);
                    queriesOutput += codeLine(`&#125;`, ['top-level']);
                    queriesOutput += `</div>\n`;
                }
            } else if (type.name === 'Mutation') {
                for (const field of Object.values(type.getFields()).sort(sortByName)) {
                    mutationsOutput += `\n## ${field.name}\n`;
                    mutationsOutput += `<div class="graphql-code-block">\n`;
                    mutationsOutput += renderDescription(field, 'multi', true);
                    mutationsOutput += codeLine(`type ${identifier('Mutation')} &#123;`, ['top-level']);
                    mutationsOutput += renderFields([field], false);
                    mutationsOutput += codeLine(`&#125;`, ['top-level']);
                    mutationsOutput += `</div>\n`;
                }
            } else {
                objectTypesOutput += `\n## ${type.name}\n\n`;
                objectTypesOutput += `<div class="graphql-code-block">\n`;
                objectTypesOutput += renderDescription(type, 'multi', true);
                objectTypesOutput += codeLine(`type ${identifier(type.name)} &#123;`, ['top-level']);
                objectTypesOutput += renderFields(type);
                objectTypesOutput += codeLine(`&#125;`, ['top-level']);
                objectTypesOutput += `</div>\n`;
            }
        }

        if (isEnumType(type)) {
            enumsOutput += `\n## ${type.name}\n\n`;
            enumsOutput += `<div class="graphql-code-block">\n`;
            enumsOutput += renderDescription(type) + '\n';
            enumsOutput += codeLine(`enum ${identifier(type.name)} &#123;`, ['top-level']);
            for (const value of type.getValues()) {
                enumsOutput += value.description ? renderDescription(value.description, 'single') : '';
                enumsOutput += codeLine(value.name);
            }
            enumsOutput += codeLine(`&#125;`, ['top-level']);
            enumsOutput += '</div>\n';
        }

        if (isScalarType(type)) {
            objectTypesOutput += `\n## ${type.name}\n\n`;
            objectTypesOutput += `<div class="graphql-code-block">\n`;
            objectTypesOutput += renderDescription(type, 'multi', true);
            objectTypesOutput += codeLine(`scalar ${identifier(type.name)}`, ['top-level']);
            objectTypesOutput += '</div>\n';
        }

        if (isInputObjectType(type)) {
            inputTypesOutput += `\n## ${type.name}\n\n`;
            inputTypesOutput += `<div class="graphql-code-block">\n`;
            inputTypesOutput += renderDescription(type, 'multi', true);
            inputTypesOutput += codeLine(`input ${identifier(type.name)} &#123;`, ['top-level']);
            inputTypesOutput += renderFields(type);
            inputTypesOutput += codeLine(`&#125;`, ['top-level']);
            inputTypesOutput += '</div>\n';
        }

        if (isUnionType(type)) {
            objectTypesOutput += `\n## ${type.name}\n\n`;
            objectTypesOutput += `<div class="graphql-code-block">\n`;
            objectTypesOutput += renderDescription(type);
            objectTypesOutput += codeLine(`union ${identifier(type.name)} =`, ['top-level']);
            objectTypesOutput += renderUnion(type);
            objectTypesOutput += '</div>\n';
        }
    }

    fs.writeFileSync(path.join(hugoOutputPath, FileName.QUERY + '.md'), queriesOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.MUTATION + '.md'), mutationsOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.OBJECT + '.md'), objectTypesOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.INPUT + '.md'), inputTypesOutput);
    fs.writeFileSync(path.join(hugoOutputPath, FileName.ENUM + '.md'), enumsOutput);

    console.log(`Generated 5 GraphQL API docs in ${+new Date() - timeStart}ms`);
}

function codeLine(content: string, extraClass?: ['top-level' | 'comment'] | undefined): string {
    return `<div class="graphql-code-line ${extraClass ? extraClass.join(' ') : ''}">${content}</div>\n`;
}

function identifier(name: string): string {
    return `<span class="graphql-code-identifier">${name}</span>`;
}

/**
 * Renders the type description if it exists.
 */
function renderDescription(
    typeOrDescription: { description?: string | null } | string,
    mode: 'single' | 'multi' = 'multi',
    topLevel = false,
): string {
    let description = '';
    if (typeof typeOrDescription === 'string') {
        description = typeOrDescription;
    } else if (!typeOrDescription.description) {
        return '';
    } else {
        description = typeOrDescription.description;
    }
    if (description.trim() === '') {
        return '';
    }
    description = description
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/{/g, '&#123;')
        .replace(/}/g, '&#125;');
    // Strip any JSDoc tags which may be used to annotate the generated
    // TS types.
    const stringsToStrip = [/@docsCategory\s+[^\n]+/g, /@description\s+/g];
    for (const pattern of stringsToStrip) {
        description = description.replace(pattern, '');
    }

    let result = '';
    const extraClass = topLevel ? ['top-level', 'comment'] : (['comment'] as any);
    if (mode === 'single') {
        result = codeLine(`"""${description}"""`, extraClass);
    } else {
        result =
            codeLine(`"""`, extraClass) +
            description
                .split('\n')
                .map(line => codeLine(`${line}`, extraClass))
                .join('\n') +
            codeLine(`"""`, extraClass);
    }
    result = result.replace(/\s`([^`]+)`\s/g, ' <code>$1</code> ');
    return result;
}

function renderFields(
    typeOrFields: (GraphQLObjectType | GraphQLInputObjectType) | Array<GraphQLField<any, any>>,
    includeDescription = true,
): string {
    let output = '';
    const fieldsArray: Array<GraphQLField<any, any>> = Array.isArray(typeOrFields)
        ? typeOrFields
        : Object.values(typeOrFields.getFields());
    for (const field of fieldsArray) {
        if (includeDescription) {
            output += field.description ? renderDescription(field.description) : '';
        }
        output += `${renderFieldSignature(field)}\n`;
    }
    output += '\n';
    return output;
}

function renderUnion(type: GraphQLUnionType): string {
    const unionTypes = type
        .getTypes()
        .map(t => renderTypeAsLink(t))
        .join(' | ');
    return codeLine(`${unionTypes}`);
}

/**
 * Renders a field signature including any argument and output type
 */
function renderFieldSignature(field: GraphQLField<any, any>): string {
    let name = field.name;
    if (field.args && field.args.length) {
        name += `(${field.args.map(arg => arg.name + ': ' + renderTypeAsLink(arg.type)).join(', ')})`;
    }
    return codeLine(`${name}: ${renderTypeAsLink(field.type)}`);
}

/**
 * Renders a type as an anchor link.
 */
function renderTypeAsLink(type: GraphQLType): string {
    const innerType = unwrapType(type);
    const fileName = isEnumType(innerType)
        ? FileName.ENUM
        : isInputObjectType(innerType)
        ? FileName.INPUT
        : FileName.OBJECT;
    const url = `${docsUrl}${fileName}#${innerType.name.toLowerCase()}`;
    return type.toString().replace(innerType.name, `<a href="${url}">${innerType.name}</a>`);
}

/**
 * Unwraps the inner type from a higher-order type, e.g. [Address!]! => Address
 */
function unwrapType(type: GraphQLType): GraphQLNamedType {
    if (isNamedType(type)) {
        return type;
    }
    let innerType = type as GraphQLType;
    while (!isNamedType(innerType)) {
        innerType = innerType.ofType;
    }
    return innerType;
}

function getTargetApiFromArgs(): TargetApi {
    const apiArg = process.argv.find(arg => /--api=(shop|admin)/.test(arg));
    if (!apiArg) {
        console.error('\nPlease specify which GraphQL API to generate docs for: --api=<shop|admin>\n');
        process.exit(1);
        return null as never;
    }
    return apiArg === '--api=shop' ? 'shop' : 'admin';
}
