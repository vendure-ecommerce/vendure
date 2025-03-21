import { Button } from '@/components/ui/button.js';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.js';
import { zoneMembersQuery } from '../zones.graphql.js';
import { api } from '@/graphql/api.js';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table.js';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area.js';

interface ZoneCountriesSheetProps {
    zoneId: string;
    zoneName: string;
    children?: React.ReactNode;
}

export function ZoneCountriesSheet({ zoneId, zoneName, children }: ZoneCountriesSheetProps) {
    const { data } = useQuery({
        queryKey: ['zone', zoneId],
        queryFn: () => api.query(zoneMembersQuery, { zoneId }),
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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    {children}
                </Button>
            </SheetTrigger>
            <SheetContent className="min-w-[800px]">
                <SheetHeader>
                    <SheetTitle>{zoneName}</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-2"></div>
                <ScrollArea className="px-6 max-h-[600px]">
                    <DataTable
                        columns={columns}
                        data={paginatedItems ?? []}
                        onPageChange={(table, page, itemsPerPage) => {
                            setPage(page);
                            setPageSize(itemsPerPage);
                        }}
                        totalItems={data?.zone?.members?.length ?? 0}
                    />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
