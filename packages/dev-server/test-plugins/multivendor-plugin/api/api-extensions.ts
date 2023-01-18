import gql from 'graphql-tag';

export const adminApiExtensions = gql`
    input RegisterSellerInput {
        shopName: String!
        administrator: CreateAdministratorInput!
    }

    extend type Mutation {
        registerNewSeller(input: RegisterSellerInput!): Channel
    }
`;
