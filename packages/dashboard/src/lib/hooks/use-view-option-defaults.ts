import { getViewOptionDefaults } from '@/vdb/framework/data-table/data-table-extensions.js';
import { usePageBlock } from '@/vdb/hooks/use-page-block.js';
import { usePage } from '@/vdb/hooks/use-page.js';

/**
 * @description
 * Extends the given view options with defaults
 * supplied via the Dashboard Extension API.
 */
export function useViewOptionDefaults<T extends string | number | symbol>(
    defaultColumnVisibility: Partial<Record<T, boolean>> | undefined,
    defaultColumnOrder: T[] | undefined,
) {
    const { pageId } = usePage();
    const pageBlock = usePageBlock({ optional: true });
    const viewOptionDefaults = pageId ? getViewOptionDefaults(pageId, pageBlock?.blockId) : {};
    return {
        defaultColumnVisibility: {
            ...(defaultColumnVisibility ?? {}),
            ...(viewOptionDefaults?.columnVisibility ?? {}),
        },
        defaultColumnOrder: [
            ...(viewOptionDefaults?.columnOrder ?? []),
            ...(defaultColumnOrder?.filter?.(
                colId => !(viewOptionDefaults?.columnOrder ?? []).includes(colId as string),
            ) ?? []),
        ],
    };
}
