import gql from 'graphql-tag';

const commonSchemaExtensions = gql`
    type PayPalOrderLink {
        href: String!
        method: String!
        rel: String!
    }

    type PayPalOrder {
        id: String!
        links: [PayPalOrderLink!]!
    }
`;

export const shopSchemaExtensions = gql`
    ${commonSchemaExtensions}
`;

export const adminSchemaExtensions = gql`
    ${commonSchemaExtensions}

    extend type Mutation {
        createPayPalOrder: PayPalOrder
    }
`;
