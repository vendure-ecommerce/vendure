import { DocumentNode, Kind, OperationDefinitionNode, print } from 'graphql';

export interface FilePlaceholder {
    file: null;
}
export interface UploadPostData<V = any> {
    operations: {
        operationName: string;
        variables: V;
        query: string;
    };

    map: {
        [index: number]: string;
    };
    filePaths: Array<{
        name: string;
        file: string;
    }>;
}

/**
 * Creates a data structure which can be used to mae a curl request to upload files to a mutation using
 * the Upload type.
 */
export function createUploadPostData<P extends string[] | string, V>(
    mutation: DocumentNode,
    filePaths: P,
    mapVariables: (filePaths: P) => V,
): UploadPostData<V> {
    const operationDef = mutation.definitions.find(
        d => d.kind === Kind.OPERATION_DEFINITION,
    ) as OperationDefinitionNode;

    const filePathsArray: string[] = Array.isArray(filePaths) ? filePaths : [filePaths];
    const variables = mapVariables(filePaths);
    const postData: UploadPostData = {
        operations: {
            operationName: operationDef.name ? operationDef.name.value : 'AnonymousMutation',
            variables,
            query: print(mutation),
        },
        map: filePathsArray.reduce((output, filePath, i) => {
            return { ...output, [i.toString()]: objectPath(variables, i).join('.') };
        }, {} as Record<number, string>),
        filePaths: filePathsArray.map((filePath, i) => ({
            name: i.toString(),
            file: filePath,
        })),
    };
    return postData;
}

function objectPath(variables: any, i: number): Array<string | number> {
    const path: Array<string | number> = ['variables'];
    let current = variables;
    while (current !== null) {
        const props = Object.getOwnPropertyNames(current);
        if (props) {
            const firstProp = props[0];
            const val = current[firstProp];
            if (Array.isArray(val)) {
                path.push(firstProp);
                path.push(i);
                current = val[0];
            } else {
                path.push(firstProp);
                current = val;
            }
        }
    }
    return path;
}
