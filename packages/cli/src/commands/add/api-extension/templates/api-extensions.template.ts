import { DocumentNode } from 'graphql/language/index';
import gql from 'graphql-tag';

const adminApiExtensionDocuments: DocumentNode[] = [];

export const adminApiExtensions = gql`
    ${adminApiExtensionDocuments.join('\n')}
`;
