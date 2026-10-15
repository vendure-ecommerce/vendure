import { ActionBarItem } from '@/vdb/framework/layout-engine/action-bar-item-wrapper.js';
import {
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { OpenConsoleButton, PlatformCapabilityList } from './components/platform-capability-list.js';

export const Route = createFileRoute('/_authenticated/_platform/platform')({
    component: PlatformPage,
    loader: () => ({ breadcrumb: () => <Trans>Vendure Platform</Trans> }),
});

function PlatformPage() {
    return (
        <Page pageId="platform">
            <PageTitle>
                <Trans>Vendure Platform</Trans>
            </PageTitle>
            <PageActionBar>
                <ActionBarItem itemId="open-console-button">
                    <OpenConsoleButton />
                </ActionBarItem>
            </PageActionBar>
            <PageLayout>
                <PageBlock
                    column="main"
                    blockId="capabilities"
                    description={
                        <Trans>
                            Vendure Platform adds capabilities to your Vendure application. The list shows
                            which capabilities this application has.
                        </Trans>
                    }
                >
                    <PlatformCapabilityList />
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
