import { AppSidebar } from '@/vdb/components/layout/app-sidebar.js';
import { GeneratedBreadcrumbs } from '@/vdb/components/layout/generated-breadcrumbs.js';
import { PrereleasePopup } from '@/vdb/components/layout/prerelease-popup.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/vdb/components/ui/sidebar.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Outlet } from '@tanstack/react-router';
import { Alerts } from '../shared/alerts.js';

export function AppLayout() {
    const { settings } = useUserSettings();
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="container mx-auto">
                    <header className="border-b border-border flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center justify-between gap-2 px-4 w-full">
                            <div className="flex items-center justify-start gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <GeneratedBreadcrumbs />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                {settings.devMode && (
                                    <Badge variant="destructive">
                                        <Trans>Dev Mode</Trans>
                                    </Badge>
                                )}
                                <Alerts />
                            </div>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </SidebarInset>
            <PrereleasePopup />
        </SidebarProvider>
    );
}
