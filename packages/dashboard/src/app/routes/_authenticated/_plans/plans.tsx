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
import { OpenConsoleButton, PlanCapabilityList } from './components/plan-capability-list.js';

export const Route = createFileRoute('/_authenticated/_plans/plans')({
    component: PlansPage,
    loader: () => ({ breadcrumb: () => <Trans>Plans</Trans> }),
});

function PlansPage() {
    return (
        <Page pageId="plans">
            <PageTitle>
                <Trans>Plans</Trans>
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
                            Paid plans add capabilities to your Vendure application. The list shows which
                            capabilities this application has.
                        </Trans>
                    }
                >
                    <PlanCapabilityList />
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
