import path from 'path';

const schemaPath = (segment: string) => path.join(__dirname, 'schema', segment, '*.graphql');

export const VENDURE_SHOP_API_TYPE_PATHS = ['shop-api', 'common', 'directives'].map(schemaPath);

export const VENDURE_ADMIN_API_TYPE_PATHS = ['admin-api', 'common', 'directives'].map(schemaPath);
