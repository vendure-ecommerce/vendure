declare module 'merge-graphql-schemas' {
    import * as MergeGraphqlSchemas from 'merge-graphql-schemas';

    export function fileLoader(fileGlob: string): any;
    export function mergeTypes(types: any[], options?: any): any;
}
