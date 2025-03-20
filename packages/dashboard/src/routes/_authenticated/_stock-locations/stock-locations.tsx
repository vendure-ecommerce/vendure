import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Link, createFileRoute } from '@tanstack/react-router';
import { stockLocationListQuery } from './stock-locations.graphql.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';

export const Route = createFileRoute('/_authenticated/_stock-locations/stock-locations')({
    component: StockLocationListPage,
});

function StockLocationListPage() {
    return (
        <ListPage
            title="Stock Locations"
            listQuery={addCustomFields(stockLocationListQuery)}
            route={Route}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
        >
            <PageActionBar>
                <PermissionGuard requires={['CreateStockLocation']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Stock Location
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
