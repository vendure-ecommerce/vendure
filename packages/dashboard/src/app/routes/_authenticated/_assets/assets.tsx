import { AssetGallery } from '@/vdb/components/shared/asset/asset-gallery.js';
import { Page, PageBlock, PageTitle } from '@/vdb/framework/layout-engine/page-layout.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DeleteAssetsBulkAction } from './components/asset-bulk-actions.js';

export const Route = createFileRoute('/_authenticated/_assets/assets')({
    component: RouteComponent,
    loader: () => ({ breadcrumb: () => <Trans>Assets</Trans> }),
    validateSearch: (search: Record<string, unknown>) => {
        return {
            perPage: (search.perPage as number) || 24,
        };
    },
});

function RouteComponent() {
    const navigate = useNavigate({ from: Route.fullPath });
    const { perPage } = Route.useSearch();

    const handlePageSizeChange = (newPageSize: number) => {
        navigate({
            search: (prev: any) => ({ ...prev, perPage: newPageSize }),
        });
    };

    return (
        <Page pageId="asset-list">
            <PageTitle>
                <Trans>Assets</Trans>
            </PageTitle>
            <PageBlock blockId="asset-gallery" column="main">
                <AssetGallery
                    selectable={true}
                    multiSelect="manual"
                    pageSize={perPage}
                    onPageSizeChange={handlePageSizeChange}
                    bulkActions={[
                        {
                            order: 10,
                            component: DeleteAssetsBulkAction,
                        },
                    ]}
                />
            </PageBlock>
        </Page>
    );
}
