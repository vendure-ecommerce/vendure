import { AppSidebar } from '@/components/layout/app-sidebar.js';
import { GeneratedBreadcrumbs } from '@/components/layout/generated-breadcrumbs.js';
import { Separator } from '@/components/ui/separator.js';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.js';
import { Outlet } from '@tanstack/react-router';
import * as React from 'react';

export function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="container mx-auto">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <GeneratedBreadcrumbs />
                        </div>
                    </header>
                    <div className="px-4">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
