# Vendure Admin UI

This is the administration interface for Vendure.

It is an Angular application built with the Angular CLI.

The UI is powered by the [Clarity Design System](https://vmware.github.io/clarity/).

## GraphQL & Typings

[apollo-codegen](https://github.com/apollographql/apollo-codegen) is used to automatically create TypeScript interfaces
for all GraphQL queries used in the application.

All queries should be located in the [`./src/app/common/queries`](./src/app/common/queries) directory. 

Run `yarn generate-gql-types` to generate TypeScript interfaces based on these queries. The generated
types are located at [`./src/app/common/types/gql-generated-types.ts`](./src/app/common/types/gql-generated-types.ts).
