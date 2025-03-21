import { Link, createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import { ListPage } from '@/framework/page/list-page.js';
import { taxCategoryListQuery } from './tax-categories.graphql.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { Badge } from '@/components/ui/badge.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';

export const Route = createFileRoute('/_authenticated/_tax-categories/tax-categories')({
    component: TaxCategoryListPage,
    loader: () => ({ breadcrumb: () => <Trans>Tax Categories</Trans> }),
});

function TaxCategoryListPage() {
    return (
        <ListPage
            listQuery={addCustomFields(taxCategoryListQuery)}
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
        >
            <PageActionBar>
                <PermissionGuard requires={['CreateTaxCategory']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Tax Category</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
