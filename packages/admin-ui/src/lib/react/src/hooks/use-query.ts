import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DataService } from '@vendure/admin-ui/core';
import { DocumentNode } from 'graphql/index';
import { useContext, useState, useCallback, useEffect } from 'react';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HostedComponentContext } from '../react-component-host.directive';

export function useQuery<T, V extends Record<string, any> = Record<string, any>>(
    query: DocumentNode | TypedDocumentNode<T, V>,
    variables?: V,
) {
    const { data, loading, error, runQuery } = useDataService<T, V>(
        (dataService, vars) => dataService.query(query, vars).stream$,
    );
    useEffect(() => {
        const subscription = runQuery(variables).subscribe();
        return () => subscription.unsubscribe();
    }, [runQuery]);

    const refetch = (variables?: V) => firstValueFrom(runQuery(variables));
    return { data, loading, error, refetch } as const;
}

export function useMutation<T, V extends Record<string, any> = Record<string, any>>(
    mutation: DocumentNode | TypedDocumentNode<T, V>,
) {
    const { data, loading, error, runQuery } = useDataService<T, V>((dataService, variables) =>
        dataService.mutate(mutation, variables),
    );
    const rest = { data, loading, error };
    const execute = (variables?: V) => firstValueFrom(runQuery(variables));
    return [execute, rest] as [typeof execute, typeof rest];
}

function useDataService<T, V extends Record<string, any> = Record<string, any>>(
    operation: (dataService: DataService, variables?: V) => Observable<T>,
) {
    const context = useContext(HostedComponentContext);
    const dataService = context?.injector.get(DataService);
    if (!dataService) {
        throw new Error('No DataService found in HostedComponentContext');
    }

    const [data, setData] = useState<T>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    const runQuery = useCallback((variables?: V) => {
        setLoading(true);
        return operation(dataService, variables).pipe(
            tap({
                next: res => {
                    setData(res);
                    setLoading(false);
                },
                error: err => {
                    setError(err.message);
                    setLoading(false);
                },
            }),
        );
    }, []);

    return { data, loading, error, runQuery };
}
