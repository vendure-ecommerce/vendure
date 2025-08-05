import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { ProductOptionChip } from '@/vdb/components/shared/product-option-chip.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ResultOf } from 'gql.tada';
import { PlusIcon } from 'lucide-react';

import {
    AssignProductOptionGroupsToChannelBulkAction,
    DeleteProductOptionGroupsBulkAction,
    DuplicateProductOptionGroupsBulkAction,
    RemoveProductOptionGroupsFromChannelBulkAction
} from './components/product-option-group-bulk-actions.js';
import { ProductOptionsSheet } from './components/product-options-sheet.js';
import { deleteProductOptionGroupDocument, productOptionGroupListDocument } from './product-option-groups.graphql.js';

export const Route = createFileRoute('/_authenticated/_product-option-groups/product-option-groups')({
    component: FacetListPage,
    loader: () => ({ breadcrumb: () => <Trans>Option Groups</Trans> }),
});

function FacetListPage() {
    return (
        <ListPage
            pageId="product-option-groups-list"
            title="Option Groups"
            listQuery={productOptionGroupListDocument}
            deleteMutation={deleteProductOptionGroupDocument}
            customizeColumns={{
                name: {
                    header: 'Group Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                optionList: {
                    header: () => <Trans>Options</Trans>,
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (!value) {
                            return null;
                        }
                        const list = value  as ResultOf<
                            typeof productOptionGroupListDocument
                        >['productOptionGroups']['items'][0]['optionList'];
                        return (
                            <div className="flex flex-wrap gap-2 items-center">
                                {list.items.map(item => {
                                    return (
                                        <ProductOptionChip
                                            key={item.id}
                                            productOption={item}
                                            removable={false}
                                            displayGroupName={false}
                                        />
                                    );
                                })}
                                <ProductOptionsSheet
                                    groupId={cell.row.original.id}
                                    groupName={cell.row.original.name}
                                >
                                    {list.totalItems > 3 ? (
                                        <div>
                                            <Trans>+ {list.totalItems - 3} more</Trans>
                                        </div>
                                    ) : (
                                        <Trans>View options</Trans>
                                    )}
                                </ProductOptionsSheet>
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
            transformVariables={variables => {
                return {
                    ...variables,
                    productOptionListOptions: {
                        take: 3,
                    },
                };
            }}
            bulkActions={[
                {
                    order: 100,
                    component: AssignProductOptionGroupsToChannelBulkAction,
                },
                {
                    order: 200,
                    component: RemoveProductOptionGroupsFromChannelBulkAction,
                },
                {
                    order: 300,
                    component: DuplicateProductOptionGroupsBulkAction,
                },
                {
                    order: 400,
                    component: DeleteProductOptionGroupsBulkAction,
                },
            ]}
            route={Route}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateCatalog', 'CreateProduct']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Option Group</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
