# Dashboard Extension API

This directory contains the extension API for the Vendure Dashboard, allowing you to customize and extend the dashboard functionality.

## Structure

The extension API is organized into domain-specific files for better maintainability:

### Types (`types/`)

- `form-components.ts` - Custom form components, input components, and display components
- `navigation.ts` - Navigation-related extensions
- `layout.ts` - Layout-related extensions
- `data-table.ts` - Data table extensions
- `detail-forms.ts` - Detail form extensions
- `alerts.ts` - Alert definition extensions
- `widgets.ts` - Widget definition extensions
- `index.ts` - Main export file

### Logic (`logic/`)

- `form-components.ts` - Logic for registering custom form components
- `navigation.ts` - Logic for navigation extensions
- `layout.ts` - Logic for layout extensions
- `data-table.ts` - Logic for data table extensions
- `detail-forms.ts` - Logic for detail form extensions
- `alerts.ts` - Logic for alert extensions
- `widgets.ts` - Logic for widget extensions
- `index.ts` - Main export file

## Usage

### Custom Form Components

#### Custom Field Components

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    customFormComponents: {
        customFields: [
            {
                id: 'my-custom-field',
                component: MyCustomFieldComponent,
            },
        ],
    },
});
```

#### Input Components

Input components can be targeted to specific pages, blocks, and fields using dedicated properties during registration. The system uses the existing key pattern (`pageId_blockId_fieldName`) for component lookup. All targeting properties are required:

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    customFormComponents: {
        inputs: [
            // Field-specific input component (all properties required)
            {
                id: 'product-name-input',
                pageId: 'product-detail',
                blockId: 'main-form',
                field: 'name',
                component: ProductNameInput,
            },

            // Another field-specific input component
            {
                id: 'product-description-input',
                pageId: 'product-detail',
                blockId: 'main-form',
                field: 'description',
                component: ProductDescriptionInput,
            },
        ],
    },
});
```

**Registration Key Generation:**
The dedicated properties (`pageId`, `blockId`, `field`) are used to generate the component key during registration:

- All components use the pattern: `pageId_blockId_field`

**Component Lookup:**
Components are always retrieved from the registry using the same key pattern: `${pageId}_${blockId}_${fieldName}`

### Navigation Extensions

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    navigation: [
        {
            id: 'custom-nav-item',
            label: 'Custom Item',
            routerLink: ['/custom'],
            icon: 'custom-icon',
        },
    ],
});
```

### Layout Extensions

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    layout: [
        {
            id: 'custom-layout',
            component: CustomLayoutComponent,
        },
    ],
});
```

### Data Table Extensions

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    dataTable: [
        {
            id: 'custom-table',
            component: CustomTableComponent,
        },
    ],
});
```

### Detail Form Extensions

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    detailForms: [
        {
            id: 'custom-detail-form',
            component: CustomDetailFormComponent,
        },
    ],
});
```

### Alert Extensions

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    alerts: [
        {
            id: 'custom-alert',
            component: CustomAlertComponent,
            props: {
                message: 'This is a custom alert',
                type: 'info',
            },
        },
    ],
});
```

### Widget Extensions

```typescript
import { defineDashboardExtension } from './extension-api/define-dashboard-extension.js';

defineDashboardExtension({
    widgets: [
        {
            id: 'custom-widget',
            component: CustomWidgetComponent,
            props: {
                title: 'Custom Widget',
                data: {
                    /* widget data */
                },
            },
        },
    ],
});
```

## Component Registration

All components are registered in a global registry that serves as a single source of truth. This ensures consistency across the dashboard and allows for better component management.

## Backward Compatibility

The extension API maintains backward compatibility with existing implementations while providing new functionality through the domain-specific structure.
