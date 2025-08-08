// Main components
export { CommandPalette } from './command-palette.js';
export { SearchTrigger } from './search-trigger.js';

// Search result components
export { SearchResultItem } from './search-result-item.js';
export { SearchResultsList } from './search-results-list.js';

// Quick action components
export { QuickActionItem } from './quick-action-item.js';
export { QuickActionsList } from './quick-actions-list.js';

// Utility components
export { RecentSearches } from './recent-searches.js';

// Hooks
export { useGlobalSearch } from './hooks/use-global-search.js';
export { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts.js';
export { useQuickActions } from './hooks/use-quick-actions.js';

// Registry (for centralized action management)
export * from './quick-actions-registry.js';

// Legacy context exports (now from registry)
export type { QuickActionDefinition as QuickAction, QuickActionContext } from './quick-actions-registry.js';
