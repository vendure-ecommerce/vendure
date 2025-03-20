import { AssetGallery } from '@/components/shared/asset-gallery.js';
import { Page, PageTitle, PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_assets/assets')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Page>
            <PageTitle><Trans>Assets</Trans></PageTitle>
            <PageActionBar>
                <AssetGallery selectable={false} />
            </PageActionBar>
        </Page>
    );
}
