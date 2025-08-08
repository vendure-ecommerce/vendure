import { QuickActionDefinition, registerQuickAction } from '@/vdb/components/global-search/index.js';

export function registerQuickActionsExtensions(quickActions?: QuickActionDefinition[]) {
    if (quickActions && quickActions.length > 0) {
        for (const action of quickActions) {
            registerQuickAction(action);
        }
    }
}
