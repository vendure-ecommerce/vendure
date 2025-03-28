import { Page, PageBlock, PageLayout, PageTitle } from '@/framework/layout-engine/page-layout.js';
import { Trans } from '@lingui/react/macro';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert.js';

export interface ErrorPageProps {
    message: string;
}

/**
 * @description
 * A generic error page that displays an error message.
 */
export function ErrorPage({ message }: ErrorPageProps) {
    return (
        <Page>
            <PageTitle>
                <Trans>Error</Trans>
            </PageTitle>
            <PageLayout>
                <PageBlock column="main">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
