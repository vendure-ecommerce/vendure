import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import {
    AssignPromotionsToChannelBulkAction,
    DeletePromotionsBulkAction,
    DuplicatePromotionsBulkAction,
    RemovePromotionsFromChannelBulkAction,
} from './components/promotion-bulk-actions.js';
import { deletePromotionDocument, promotionListDocument } from './promotions.graphql.js';

export const Route = createFileRoute('/_authenticated/_promotions/promotions')({
    component: PromotionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Promotions</Trans> }),
});

function PromotionListPage() {
    return (
        <ListPage
            pageId="promotion-list"
            listQuery={promotionListDocument}
            deleteMutation={deletePromotionDocument}
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
            bulkActions={[
                {
                    order: 100,
                    component: AssignPromotionsToChannelBulkAction,
                },
                {
                    order: 200,
                    component: RemovePromotionsFromChannelBulkAction,
                },
                {
                    order: 300,
                    component: DuplicatePromotionsBulkAction,
                },
                {
                    order: 400,
                    component: DeletePromotionsBulkAction,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreatePromotion']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Promotion</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
