import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { Link, createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { deleteStockLocationDocument, stockLocationListQuery } from './stock-locations.graphql.js';
export const Route = createFileRoute('/_authenticated/_stock-locations/stock-locations')({
    component: StockLocationListPage,
    loader: () => ({ breadcrumb: () => <Trans>Stock Locations</Trans> }),
});

function StockLocationListPage() {
    return (
        <ListPage
            pageId="stock-location-list"
            title="Stock Locations"
            listQuery={stockLocationListQuery}
            deleteMutation={deleteStockLocationDocument}
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
                <PageActionBarRight>
                    <PermissionGuard requires={['CreateStockLocation']}>
                        <Button asChild>
                            <Link to="./new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Stock Location
                            </Link>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
        </ListPage>
    );
}
