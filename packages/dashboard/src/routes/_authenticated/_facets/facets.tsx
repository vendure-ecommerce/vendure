import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { Button } from '@/components/ui/button.js';
import { ListPage } from '@/framework/page/list-page.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { facetListDocument } from './facets.graphql.js';
import { FacetValueChip } from '@/components/shared/facet-value-chip.js';

import { ResultOf } from 'gql.tada';
import { FacetValuesSheet } from './components/facet-values-sheet.js';
import { Badge } from '@/components/ui/badge.js';

export const Route = createFileRoute('/_authenticated/_facets/facets')({
    component: FacetListPage,
    loader: () => ({ breadcrumb: () => <Trans>Facets</Trans> }),
});

export function FacetListPage() {
    return (
        <ListPage
            title="Facets"
            customizeColumns={{
                name: {
                    header: 'Facet Name',
                    cell: ({ row }) => {
                        return (
                            <Link to={`./${row.original.id}`}>
                                <Button variant="ghost">{row.original.name}</Button>
                            </Link>
                        );
                    },
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
                                <Badge variant="outline">
                                    {list.totalItems > 3 && (
                                        <div>
                                            <Trans>+ {list.totalItems - 3} more</Trans>
                                        </div>
                                    )}
                                    <FacetValuesSheet facetId={cell.row.original.id} facetName={cell.row.original.name} />
                                </Badge>
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
            listQuery={addCustomFields(facetListDocument)}
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
                <div></div>
                <PermissionGuard requires={['CreateFacet', 'CreateCatalog']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Facet</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
