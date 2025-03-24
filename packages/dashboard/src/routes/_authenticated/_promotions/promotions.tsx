import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { Link, createFileRoute } from '@tanstack/react-router';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { promotionListDocument } from './promotions.graphql.js';
import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';

export const Route = createFileRoute('/_authenticated/_promotions/promotions')({
    component: PromotionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Promotions</Trans> }),
});

function PromotionListPage() {  
    return (
        <ListPage
            listQuery={promotionListDocument}
            route={Route}
            title="Promotions"
            defaultVisibility={{
                name: true,
                couponCode: true,
                enabled: true,
                startsAt: true,
                endsAt: true,
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                    couponCode: { contains: searchTerm },
                };
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                enabled: {
                    header: 'Enabled',
                    cell: ({ row }) => <BooleanDisplayBadge value={row.original.enabled} />,
                },
            }}
        >
            <PageActionBar>
                <div></div>
                <PermissionGuard requires={['CreatePromotion']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Promotion</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
