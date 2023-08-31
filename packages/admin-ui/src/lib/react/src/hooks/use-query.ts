import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DataService } from '@vendure/admin-ui/core';
import { DocumentNode } from 'graphql/index';
import { useContext, useState, useCallback, useEffect } from 'react';
import { Observable } from 'rxjs';
import { HostedComponentContext } from '../react-component-host.directive';

export function useQuery<T, V extends Record<string, any> = Record<string, any>>(
    query: DocumentNode | TypedDocumentNode<T, V>,
    variables?: V,
) {
    const { data, loading, error, refetch } = useDataService(
        dataService => dataService.query(query, variables).stream$,
    );
    return { data, loading, error, refetch };
}

export function useMutation<T, V extends Record<string, any> = Record<string, any>>(
    mutation: DocumentNode | TypedDocumentNode<T, V>,
) {
    const { data, loading, error, refetch } = useDataService(dataService => dataService.mutate(mutation));
    return { data, loading, error, refetch };
}

function useDataService<T, V extends Record<string, any> = Record<string, any>>(
    operation: (dataService: DataService) => Observable<T>,
) {
    const context = useContext(HostedComponentContext);
    const dataService = context?.injector.get(DataService);
    if (!dataService) {
        throw new Error('No DataService found in HostedComponentContext');
    }

    const [data, setData] = useState<T>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    const runQuery = useCallback(() => {
        setLoading(true);
        operation(dataService).subscribe({
            next: (res: any) => {
                setData(res.data);
            },
            error: err => {
                setError(err.message);
                setLoading(false);
            },
        });
    }, []);

    useEffect(() => {
        runQuery();
    }, [runQuery]);

    return { data, loading, error, refetch: runQuery };
}
