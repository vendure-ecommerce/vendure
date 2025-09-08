import { AssetGallery } from '@/vdb/components/shared/asset/asset-gallery.js';
import { Page, PageBlock, PageTitle } from '@/vdb/framework/layout-engine/page-layout.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute } from '@tanstack/react-router';
import { DeleteAssetsBulkAction } from './components/asset-bulk-actions.js';

export const Route = createFileRoute('/_authenticated/_assets/assets')({
    component: RouteComponent,
    loader: () => ({ breadcrumb: () => <Trans>Assets</Trans> }),
});

function RouteComponent() {
    return (
        <Page pageId="asset-list">
            <PageTitle>
                <Trans>Assets</Trans>
            </PageTitle>
            <PageBlock blockId="asset-gallery" column="main">
                <AssetGallery
                    selectable={true}
                    multiSelect="manual"
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
