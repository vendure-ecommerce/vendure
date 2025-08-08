import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { useCallback, useEffect } from 'react';

import { useQuickActions } from './use-quick-actions.js';

export const useKeyboardShortcuts = () => {
    const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useSearchContext();
    const { actions, executeAction } = useQuickActions();

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check if user is typing in an input field
            const isTyping =
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                (document.activeElement as HTMLElement)?.contentEditable === 'true';

            // Global shortcuts that work even when typing (with Cmd/Ctrl)
            if (event.metaKey || event.ctrlKey) {
                // Cmd/Ctrl + K to open command palette
                if (event.key === 'k') {
                    event.preventDefault();
                    setIsCommandPaletteOpen(true);
                    return;
                }

                // Check for quick action shortcuts
                const shortcutKey = event.shiftKey
                    ? `${event.metaKey ? 'cmd' : 'ctrl'}+shift+${event.key.toLowerCase()}`
                    : `${event.metaKey ? 'cmd' : 'ctrl'}+${event.key.toLowerCase()}`;

                const matchingAction = actions.find(
                    action =>
                        action.shortcut === shortcutKey ||
                        action.shortcut === shortcutKey.replace('cmd', 'ctrl') ||
                        action.shortcut === shortcutKey.replace('ctrl', 'cmd'),
                );

                if (matchingAction) {
                    event.preventDefault();

                    // Don't execute if command palette is open, let it handle the shortcut
                    if (!isCommandPaletteOpen) {
                        void executeAction(matchingAction.id);
                    }
                    return;
                }
            }

            // Escape to close command palette
            if (event.key === 'Escape' && isCommandPaletteOpen) {
                event.preventDefault();
                setIsCommandPaletteOpen(false);
                return;
            }

            // Don't handle other shortcuts if user is typing
            if (isTyping) {
                return;
            }
        },
        [isCommandPaletteOpen, setIsCommandPaletteOpen, actions, executeAction],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return {
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
    };
};
