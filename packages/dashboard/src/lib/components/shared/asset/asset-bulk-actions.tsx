'use client';

import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { getBulkActions } from '@/vdb/framework/data-table/data-table-extensions.js';
import { usePageBlock } from '@/vdb/hooks/use-page-block.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { ChevronDown } from 'lucide-react';
import { Asset } from './asset-gallery.js';

export type AssetBulkActionContext = {
    selection: Asset[];
    refetch: () => void;
};

export type AssetBulkActionComponent = React.FunctionComponent<AssetBulkActionContext>;

export type AssetBulkAction = {
    order?: number;
    component: AssetBulkActionComponent;
};

interface AssetBulkActionsProps {
    selection: Asset[];
    bulkActions?: AssetBulkAction[];
    refetch: () => void;
}

export function AssetBulkActions({ selection, bulkActions, refetch }: Readonly<AssetBulkActionsProps>) {
    const { pageId } = usePage();
    const { blockId } = usePageBlock();

    if (selection.length === 0) {
        return null;
    }

    // Get extended bulk actions from the registry
    const extendedBulkActions = pageId ? getBulkActions(pageId, blockId) : [];

    // Convert DataTable bulk actions to Asset bulk actions
    const convertedBulkActions: AssetBulkAction[] = extendedBulkActions.map(action => ({
        order: action.order,
        component: ({ selection }) => {
            // Create a mock table context for compatibility
            const mockTable = {
                getState: () => ({ rowSelection: {} }),
                getRow: () => null,
            } as any;

            const ActionComponent = action.component;
            return <ActionComponent selection={selection} table={mockTable} />;
        },
    }));

    const allBulkActions = [...convertedBulkActions, ...(bulkActions ?? [])];
    allBulkActions.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));

    return (
        <div className="flex items-center gap-2 px-2 py-1 mb-2 bg-muted/50 rounded-md border">
            <span className="text-sm text-muted-foreground">
                <Trans>{selection.length} selected</Trans>
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                        <Trans>With selected...</Trans>
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {allBulkActions.length > 0 ? (
                        allBulkActions.map((action, index) => (
                            <action.component
                                key={`asset-bulk-action-${index}`}
                                selection={selection}
                                refetch={refetch}
                            />
                        ))
                    ) : (
                        <DropdownMenuItem className="text-muted-foreground" disabled>
                            <Trans>No actions available</Trans>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
