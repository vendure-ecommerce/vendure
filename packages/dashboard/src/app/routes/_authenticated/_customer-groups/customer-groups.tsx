import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { DeleteCustomerGroupsBulkAction } from './components/customer-group-bulk-actions.js';
import { CustomerGroupMembersSheet } from './components/customer-group-members-sheet.js';
import { customerGroupListDocument, deleteCustomerGroupDocument } from './customer-groups.graphql.js';

export const Route = createFileRoute('/_authenticated/_customer-groups/customer-groups')({
    component: CustomerGroupListPage,
    loader: () => ({ breadcrumb: () => <Trans>Customer Groups</Trans> }),
});

function CustomerGroupListPage() {
    return (
        <ListPage
            pageId="customer-group-list"
            title="Customer Groups"
            listQuery={customerGroupListDocument}
            deleteMutation={deleteCustomerGroupDocument}
            route={Route}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                customers: {
                    header: () => <Trans>Values</Trans>,
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (!value) {
                            return null;
                        }
                        return (
                            <div className="flex flex-wrap gap-2 items-center">
                                <CustomerGroupMembersSheet
                                    customerGroupId={cell.row.original.id}
                                    customerGroupName={cell.row.original.name}
                                >
                                    <Trans>{value.totalItems} customers</Trans>
                                </CustomerGroupMembersSheet>
                            </div>
                        );
                    },
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            bulkActions={[
                {
                    component: DeleteCustomerGroupsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateCustomerGroup']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Customer Group</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
