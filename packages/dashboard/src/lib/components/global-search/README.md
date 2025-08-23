# Global Search Frontend Implementation

This directory contains the React components and hooks for the Vendure dashboard global search feature.

## Components

### Core Components
- **`CommandPalette`** - Main search dialog using cmdk
- **`SearchTrigger`** - Search button in the header with keyboard shortcut display

### Search Results
- **`SearchResultsList`** - Container for search results grouped by type
- **`SearchResultItem`** - Individual search result with icon, title, subtitle, and actions

### Quick Actions
- **`QuickActionsList`** - Container for quick actions filtered by search query
- **`QuickActionItem`** - Individual quick action with keyboard shortcuts

### Utility Components
- **`RecentSearches`** - Shows recent search queries when no search is active

## Hooks

### Search Hooks
- **`useGlobalSearch`** - Handles search API integration with debouncing
- **`useQuickActions`** - Manages built-in and custom quick actions
- **`useKeyboardShortcuts`** - Global keyboard shortcut handling

## Context

### SearchProvider
- **`SearchProvider`** - Global state management for search functionality
- **`useSearchContext`** - Access to search state and actions

## Features Implemented

### 🔍 Global Search
- Command palette interface (⌘K to open)
- Real-time search with 300ms debouncing
- Grouped results by entity type
- External link handling
- Recent search history

### ⚡ Quick Actions
- Built-in global actions (create, navigate, etc.)
- Context-aware actions (based on current page)
- Custom keyboard shortcuts
- Action categorization

### ⌨️ Keyboard Navigation
- ⌘K / Ctrl+K to open command palette
- Escape to close
- All quick action shortcuts work globally
- Full keyboard navigation within palette

### 🎨 UI/UX
- Modern command palette design using existing cmdk components
- Icons for different entity types
- Badges for result types and context actions
- Loading states and empty states
- Responsive design

## Usage

The global search is automatically integrated into the `AppLayout` and will be available on all authenticated pages. Users can:

1. Click the search button in the header
2. Press ⌘K (Mac) or Ctrl+K (Windows/Linux)
3. Start typing to search entities
4. Use quick actions for common tasks
5. Navigate using keyboard or mouse

## Extension Points

### Custom Quick Actions
Developers can register custom quick actions through the extension API (to be implemented in backend):

```typescript
// Example of how custom actions would be registered
registerQuickAction({
  id: 'my-custom-action',
  label: 'My Custom Action',
  shortcut: 'ctrl+shift+m',
  handler: (context) => {
    // Custom action logic
  }
});
```

## Backend Integration

This frontend implementation expects the following GraphQL API:

```graphql
query GlobalSearch($input: GlobalSearchInput!) {
  globalSearch(input: $input) {
    id
    type
    title
    subtitle
    description
    url
    thumbnailUrl
    metadata
    relevanceScore
    lastModified
  }
}
```

The backend implementation is defined in the `GLOBAL_SEARCH_IMPLEMENTATION_PLAN.md` and should be implemented separately.