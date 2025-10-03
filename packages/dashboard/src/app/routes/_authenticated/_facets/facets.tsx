import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { FacetValueChip } from '@/vdb/components/shared/facet-value-chip.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ResultOf } from 'gql.tada';
import { PlusIcon } from 'lucide-react';
import {
    AssignFacetsToChannelBulkAction,
    DeleteFacetsBulkAction,
    DuplicateFacetsBulkAction,
    RemoveFacetsFromChannelBulkAction,
} from './components/facet-bulk-actions.js';
import { FacetValuesSheet } from './components/facet-values-sheet.js';
import { deleteFacetDocument, facetListDocument } from './facets.graphql.js';
import { DataTableCellComponent } from '@/vdb/components/data-table/types.js';

export const Route = createFileRoute('/_authenticated/_facets/facets')({
    component: FacetListPage,
    loader: () => ({ breadcrumb: () => <Trans>Facets</Trans> }),
});

const FacetValuesCell: DataTableCellComponent<ResultOf<typeof facetListDocument>['facets']['items'][0]> = ({
    row,
}) => {
    const value = row.original.valueList;
    if (!value) {
        return null;
    }
    const list = value;
    return (
        <div className="flex flex-wrap gap-2 items-center">
            {list.items.map(item => {
                return (
                    <FacetValueChip
                        key={item.id}
                        facetValue={item}
                        removable={false}
                        displayFacetName={false}
                    />
                );
            })}
            <FacetValuesSheet facetId={row.original.id} facetName={row.original.name}>
                {list.totalItems > 3 ? (
                    <div>
                        <Trans>+ {list.totalItems - 3} more</Trans>
                    </div>
                ) : (
                    <Trans>View values</Trans>
                )}
            </FacetValuesSheet>
        </div>
    );
};

function FacetListPage() {
    return (
        <ListPage
            pageId="facet-list"
            title="Facets"
            listQuery={facetListDocument}
            defaultVisibility={{
                name: true,
                isPrivate: true,
                valueList: true,
            }}
            customizeColumns={{
                name: {
                    header: () => <Trans>Facet Name</Trans>,
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                isPrivate: {
                    header: () => <Trans>Visibility</Trans>,
                    cell: ({ row }) => {
                        const isPrivate = row.original.isPrivate;
                        return (
                            <Badge variant={isPrivate ? 'destructive' : 'success'}>
                                {isPrivate ? <Trans>private</Trans> : <Trans>public</Trans>}
                            </Badge>
                        );
                    },
                },
                valueList: {
                    header: () => <Trans>Values</Trans>,
                    cell: FacetValuesCell,
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
                    facetValueListOptions: {
                        take: 3,
                    },
                };
            }}
            bulkActions={[
                {
                    order: 100,
                    component: AssignFacetsToChannelBulkAction,
                },
                {
                    order: 200,
                    component: RemoveFacetsFromChannelBulkAction,
                },
                {
                    order: 300,
                    component: DuplicateFacetsBulkAction,
                },
                {
                    order: 400,
                    component: DeleteFacetsBulkAction,
                },
            ]}
            route={Route}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateFacet', 'CreateCatalog']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Facet</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
