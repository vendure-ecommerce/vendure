import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { Link, createFileRoute } from '@tanstack/react-router';
import { sellerListQuery } from './sellers.graphql.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
export const Route = createFileRoute('/_authenticated/_sellers/sellers')({
    component: SellerListPage,
    loader: () => ({ breadcrumb: () => <Trans>Sellers</Trans> }),
});

function SellerListPage() {
    return (
        <ListPage
            listQuery={sellerListQuery}
            route={Route}
            title="Sellers"
            defaultVisibility={{
                name: true,
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
        >
            <PageActionBar>
                <div></div>
                <PermissionGuard requires={['CreateSeller']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Seller
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
