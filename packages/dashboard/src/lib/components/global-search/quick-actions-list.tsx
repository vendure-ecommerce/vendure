import { CommandGroup } from '@/vdb/components/ui/command.js';
import { QuickActionItem } from './quick-action-item.js';
import { useQuickActions } from './hooks/use-quick-actions.js';
import { useMemo } from 'react';

interface QuickActionsListProps {
    searchQuery: string;
    onActionSelect: (actionId: string) => void;
}

export function QuickActionsList({ searchQuery, onActionSelect }: QuickActionsListProps) {
    const { actions, executeAction } = useQuickActions();

    // Filter actions based on search query
    const filteredActions = useMemo(() => {
        if (!searchQuery.trim()) {
            // Show all actions when no search query
            return actions;
        }

        const query = searchQuery.toLowerCase();
        return actions.filter(action => 
            action.label.toLowerCase().includes(query) ||
            action.description?.toLowerCase().includes(query) ||
            action.id.toLowerCase().includes(query)
        );
    }, [actions, searchQuery]);

    const handleActionSelect = async (actionId: string) => {
        onActionSelect(actionId);
        await executeAction(actionId);
    };

    if (filteredActions.length === 0) {
        return null;
    }

    // Group actions by type
    const globalActions = filteredActions.filter(action => !action.isContextAware);
    const contextActions = filteredActions.filter(action => action.isContextAware);

    return (
        <>
            {globalActions.length > 0 && (
                <CommandGroup heading="Quick Actions">
                    {globalActions.map(action => (
                        <QuickActionItem
                            key={action.id}
                            action={action}
                            onSelect={handleActionSelect}
                        />
                    ))}
                </CommandGroup>
            )}

            {contextActions.length > 0 && (
                <CommandGroup heading="Context Actions">
                    {contextActions.map(action => (
                        <QuickActionItem
                            key={action.id}
                            action={action}
                            onSelect={handleActionSelect}
                        />
                    ))}
                </CommandGroup>
            )}
        </>
    );
}