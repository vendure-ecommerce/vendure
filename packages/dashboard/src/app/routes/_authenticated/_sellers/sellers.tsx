import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { deleteSellerDocument, sellerListQuery } from './sellers.graphql.js';

export const Route = createFileRoute('/_authenticated/_sellers/sellers')({
    component: SellerListPage,
    loader: () => ({ breadcrumb: () => <Trans>Sellers</Trans> }),
});

function SellerListPage() {
    return (
        <ListPage
            pageId="seller-list"
            listQuery={sellerListQuery}
            deleteMutation={deleteSellerDocument}
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
            <PageActionBarRight>
                <PermissionGuard requires={['CreateSeller']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Seller
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
