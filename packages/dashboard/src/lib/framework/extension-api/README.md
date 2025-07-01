# Dashboard Extension API

This directory contains the extension API for the Vendure dashboard, organized into domain-specific modules for better maintainability and readability.

## Structure

```
extension-api/
├── types/                    # Domain-specific type definitions
│   ├── alerts.ts            # Alert types
│   ├── form-components.ts    # Form component types
│   ├── navigation.ts         # Navigation types
│   ├── layout.ts            # Layout types
│   ├── data-table.ts        # Data table types
│   ├── detail-forms.ts      # Detail form types
│   ├── widgets.ts           # Widget types
│   └── index.ts             # Type exports
├── logic/                   # Domain-specific logic
│   ├── alerts.ts           # Alert registration logic
│   ├── form-components.ts   # Form component registration logic
│   ├── navigation.ts        # Navigation registration logic
│   ├── layout.ts           # Layout registration logic
│   ├── data-table.ts       # Data table registration logic
│   ├── widgets.ts          # Widget registration logic
│   └── index.ts            # Logic exports
├── input-component-extensions.tsx    # Input component registry
├── display-component-extensions.tsx  # Display component registry
├── extension-api-types.ts           # Main extension interface
├── define-dashboard-extension.ts    # Main extension registration
└── README.md                        # This file
```

## Domain-Specific Organization

### Types (`/types`)

Each domain has its own type definitions:

- **`alerts.ts`** - Alert definitions and types
- **`form-components.ts`** - Custom form components, input components, and display components
- **`navigation.ts`** - Routes and navigation sections
- **`layout.ts`** - Action bar items and page blocks
- **`data-table.ts`** - Data table extensions and bulk actions
- **`detail-forms.ts`** - Detail form document extensions
- **`widgets.ts`** - Widget definitions and types

### Logic (`/logic`)

Each domain has its own registration logic:

- **`alerts.ts`** - Handles registration of dashboard alerts
- **`form-components.ts`** - Handles registration of custom form components and display components
- **`navigation.ts`** - Handles registration of navigation sections and routes
- **`layout.ts`** - Handles registration of action bar items and page blocks
- **`data-table.ts`** - Handles registration of data table extensions and detail form extensions
- **`widgets.ts`** - Handles registration of dashboard widgets

## Usage

### Main Extension Interface

The main entry point is `defineDashboardExtension()` which accepts a `DashboardExtension` object:

```typescript
import { defineDashboardExtension } from '@vendure/dashboard';

defineDashboardExtension({
    // Navigation
    navSections: [...],
    routes: [...],

    // Layout
    actionBarItems: [...],
    pageBlocks: [...],

    // Form Components
    customFormComponents: {
        customFields: [...],
        inputs: [...],
    },
    displayComponents: [...],

    // Data Tables
    dataTables: [...],
    detailForms: [...],

    // Widgets
    widgets: [...],

    // Alerts
    alerts: [...],
});
```

### Custom Form Components

The unified form component system allows registration of both custom field components and input components:

```typescript
defineDashboardExtension({
    customFormComponents: {
        // Custom field components (for custom fields)
        customFields: [
            {
                id: 'my-custom-field',
                component: MyCustomFieldComponent,
            },
        ],
        // Input components (for detail forms)
        inputs: [
            {
                id: 'my-custom-input',
                component: MyCustomInputComponent,
            },
        ],
    },
    // Display components (for data display)
    displayComponents: [
        {
            id: 'my-custom-display',
            component: MyCustomDisplayComponent,
        },
    ],
});
```

### Alerts

Alerts can be defined to show important information to users:

```typescript
defineDashboardExtension({
    alerts: [
        {
            id: 'system-maintenance',
            title: 'System Maintenance',
            description: 'Scheduled maintenance in 2 hours',
            severity: 'warning',
            check: async () => {
                // Check if maintenance is scheduled
                return { maintenanceScheduled: true };
            },
            recheckInterval: 60000, // Check every minute
        },
    ],
});
```

### Widgets

Widgets can be added to the dashboard:

```typescript
defineDashboardExtension({
    widgets: [
        {
            id: 'sales-chart',
            name: 'Sales Chart',
            component: SalesChartWidget,
            defaultSize: { w: 6, h: 4, x: 0, y: 0 },
            minSize: { w: 4, h: 3 },
            maxSize: { w: 12, h: 8 },
        },
    ],
});
```

## Benefits of Domain-Specific Organization

1. **Better Maintainability** - Related functionality is grouped together
2. **Improved Readability** - Smaller, focused files are easier to understand
3. **Easier Testing** - Domain-specific logic can be tested independently
4. **Better Code Organization** - Clear separation of concerns
5. **Easier Extension** - New domains can be added without affecting existing code

## Adding New Domains

To add a new domain:

1. Create a new type file in `/types/` (e.g., `new-domain.ts`)
2. Create a new logic file in `/logic/` (e.g., `new-domain.ts`)
3. Export the types from `/types/index.ts`
4. Export the logic from `/logic/index.ts`
5. Add the new domain to the `DashboardExtension` interface in `extension-api-types.ts`
6. Add the registration logic to `define-dashboard-extension.ts`

## Built-in Components

The following components are automatically registered:

### Input Components

- `vendure:textInput` - Basic text input
- `vendure:numberInput` - Number input
- `vendure:dateTimeInput` - DateTime picker
- `vendure:checkboxInput` - Checkbox
- `vendure:moneyInput` - Money input
- `vendure:facetValueInput` - Facet value selector

### Display Components

- `vendure:booleanCheckbox` - Boolean as checkbox
- `vendure:booleanBadge` - Boolean as badge
- `vendure:dateTime` - DateTime display
- `vendure:asset` - Asset/image display
- `vendure:money` - Money display
