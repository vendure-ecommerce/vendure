import { FacetValueChip } from '@/components/shared/facet-value-chip.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { facetListDocument, deleteFacetDocument } from './facets.graphql.js';

import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { ResultOf } from 'gql.tada';
import { FacetValuesSheet } from './components/facet-values-sheet.js';

export const Route = createFileRoute('/_authenticated/_facets/facets')({
    component: FacetListPage,
    loader: () => ({ breadcrumb: () => <Trans>Facets</Trans> }),
});

function FacetListPage() {
    return (
        <ListPage
            pageId="facet-list"
            title="Facets"
            listQuery={facetListDocument}
            deleteMutation={deleteFacetDocument}
            customizeColumns={{
                name: {
                    header: 'Facet Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                valueList: {
                    header: () => <Trans>Values</Trans>,
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (!value) return null;
                        const list = value as any as ResultOf<
                            typeof facetListDocument
                        >['facets']['items'][0]['valueList'];
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
                                <FacetValuesSheet
                                    facetId={cell.row.original.id}
                                    facetName={cell.row.original.name}
                                >
                                    {list.totalItems > 3 ? (
                                        <div>
                                            <Trans>+ {list.totalItems - 3} more</Trans>
                                        </div>) : <Trans>View values</Trans>
                                    }
                                </FacetValuesSheet>
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
                    facetValueListOptions: {
                        take: 3,
                    },
                };
            }}
            route={Route}
        >
            <PageActionBar>
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
            </PageActionBar>
        </ListPage>
    );
}
