import { getBulkActions } from '@/vdb/framework/data-table/data-table-extensions.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { usePageBlock } from '@/vdb/hooks/use-page-block.js';
import { usePage } from '@/vdb/hooks/use-page.js';

/**
 * @description
 * Augments the provided Bulk Actions with any user-defined actions for the current
 * page & block, and returns all of the bulk actions sorted by the `order` property.
 */
export function useAllBulkActions(bulkActions: BulkAction[]): BulkAction[] {
    const { pageId } = usePage();
    const pageBlock = usePageBlock();
    const blockId = pageBlock?.blockId;
    const extendedBulkActions = pageId ? getBulkActions(pageId, blockId) : [];
    const allBulkActions = [...extendedBulkActions, ...(bulkActions ?? [])];
    allBulkActions.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));
    return allBulkActions;
}
