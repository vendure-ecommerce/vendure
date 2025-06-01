import { AssetGallery } from '@/components/shared/asset/asset-gallery.js';
import { Page, PageTitle, PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_assets/assets')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Page pageId="asset-list">
            <PageTitle>
                <Trans>Assets</Trans>
            </PageTitle>
            <AssetGallery selectable={true} multiSelect='manual' />
        </Page>
    );
}
