import { DataTable } from '@/components/data-table/data-table.js';
import { api } from '@/graphql/api.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { addCountryToZoneMutation, removeCountryFromZoneMutation, zoneMembersQuery } from '../zones.graphql.js';
import { CountrySelector } from '@/components/shared/country-selector.js';

interface ZoneCountriesTableProps {
    zoneId: string;
    canAddCountries?: boolean;
}

export function ZoneCountriesTable({ zoneId, canAddCountries = false }: ZoneCountriesTableProps) {
    const { data, refetch } = useQuery({
        queryKey: ['zone', zoneId],
        queryFn: () => api.query(zoneMembersQuery, { zoneId }),
    });

    const { mutate: addCountryToZone } = useMutation({
        mutationFn: api.mutate(addCountryToZoneMutation),
        onSuccess: () => {
            refetch();
        },
    });

    const { mutate: removeCountryFromZone } = useMutation({
        mutationFn: api.mutate(removeCountryFromZoneMutation),
        onSuccess: () => {
            refetch();
        },
    });

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const paginatedItems = useMemo(() => {
        return data?.zone?.members?.slice((page - 1) * pageSize, page * pageSize);
    }, [data, page, pageSize]);

    const columns: ColumnDef<any>[] = [
        {
            header: 'Country',
            accessorKey: 'name',
        },
        {
            header: 'Enabled',
            accessorKey: 'enabled',
        },
        {
            header: 'Code',
            accessorKey: 'code',
        },
    ];

    return (
        <div>
            <DataTable
                columns={columns}
                data={paginatedItems ?? []}
                onPageChange={(table, page, itemsPerPage) => {
                setPage(page);
                setPageSize(itemsPerPage);
            }}
                totalItems={data?.zone?.members?.length ?? 0}
            />
            {canAddCountries && (
                <CountrySelector
                    onSelect={country => {
                        addCountryToZone({
                            zoneId,
                            memberIds: [country.id],
                        });
                    }}
                />
            )}
        </div>
    );
}
