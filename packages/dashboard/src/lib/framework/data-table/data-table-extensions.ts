import { BulkAction } from '@/framework/data-table/data-table-types.js';

import { globalRegistry } from '../registry/global-registry.js';

globalRegistry.register('bulkActionsRegistry', new Map<string, BulkAction[]>());

export function getBulkActions(pageId: string, blockId = 'list-table'): BulkAction[] {
    const key = createKey(pageId, blockId);
    return globalRegistry.get('bulkActionsRegistry').get(key) || [];
}

export function addBulkAction(pageId: string, blockId: string | undefined, action: BulkAction) {
    const bulkActionsRegistry = globalRegistry.get('bulkActionsRegistry');
    const key = createKey(pageId, blockId);
    const existingActions = bulkActionsRegistry.get(key) || [];
    bulkActionsRegistry.set(key, [...existingActions, action]);
}

function createKey(pageId: string, blockId: string | undefined): string {
    return `${pageId}__${blockId ?? 'list-table'}`;
}
