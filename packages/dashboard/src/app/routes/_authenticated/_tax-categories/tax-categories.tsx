import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { DeleteTaxCategoriesBulkAction } from './components/tax-category-bulk-actions.js';
import { taxCategoryListQuery } from './tax-categories.graphql.js';

export const Route = createFileRoute('/_authenticated/_tax-categories/tax-categories')({
    component: TaxCategoryListPage,
    loader: () => ({ breadcrumb: () => <Trans>Tax Categories</Trans> }),
});

function TaxCategoryListPage() {
    return (
        <ListPage
            pageId="tax-category-list"
            listQuery={taxCategoryListQuery}
            route={Route}
            title="Tax Categories"
            defaultVisibility={{
                name: true,
                isDefault: true,
            }}
            onSearchTermChange={searchTerm => {
                if (searchTerm === '') {
                    return {};
                }

                return {
                    name: { contains: searchTerm },
                };
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                isDefault: {
                    header: 'Default',
                    cell: ({ row }) => (
                        <Badge variant={row.original.isDefault ? 'success' : 'destructive'}>
                            <Trans>{row.original.isDefault ? 'Yes' : 'No'}</Trans>
                        </Badge>
                    ),
                },
            }}
            bulkActions={[
                {
                    component: DeleteTaxCategoriesBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateTaxCategory']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Tax Category</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
