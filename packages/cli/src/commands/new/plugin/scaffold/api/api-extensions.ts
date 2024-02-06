import { constantCase, pascalCase } from 'change-case';

import { TemplateContext } from '../../types';

export function renderApiExtensions(context: TemplateContext) {
    if (!context.withApiExtensions) {
        return '';
    }
    if (!context.withCustomEntity) {
        return /* language=TypeScript */ `
import gql from 'graphql-tag';
export const shopApiExtensions = gql\`
    extend type Query {
       exampleShopQuery: String!
    }
    extend type Mutation {
       exampleShopMutation(input: String!): String!
    }
\`;

export const adminApiExtensions = gql\`
     extend type Query {
       exampleAdminQuery: String!
    }
    extend type Mutation {
       exampleAdminMutation(input: String!): String!
    }
\`;
`;
    } else {
        const entityName = context.entity.className;
        return /* language=TypeScript */ `
import gql from 'graphql-tag';

export const commonApiExtensions = gql\`
    type ${entityName} implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
    }

    type ${entityName}List implements PaginatedList {
        items: [${entityName}!]!
        totalItems: Int!
    }

    extend type Query {
        ${context.entity.instanceName}s(options: ${entityName}ListOptions): ${entityName}List!
        ${context.entity.instanceName}(id: ID!): ${entityName}
    }

    # Auto-generated at runtime
    input ${entityName}ListOptions
\`;

export const shopApiExtensions = gql\`
    \${commonApiExtensions}
\`;

export const adminApiExtensions = gql\`
    \${commonApiExtensions}

    extend type Mutation {
        create${entityName}(input: Create${entityName}Input!): ${entityName}!
        update${entityName}(input: Update${entityName}Input!): ${entityName}!
    }

    input Create${entityName}Input {
        name: String!
    }

    input Update${entityName}Input {
        id: ID!
        name: String!
    }
\`;
`;
    }
}
