import { defineDashboardExtension } from '../define-dashboard-extension.js';
import { DashboardInputComponent } from '../types/form-components.js';

// Example input components
const ProductNameInput: DashboardInputComponent['component'] = ({ value, onChange, ...props }) => {
    // This would be a React component in practice
    return null; // Placeholder for example
};

const ProductDescriptionInput: DashboardInputComponent['component'] = ({ value, onChange, ...props }) => {
    // This would be a React component in practice
    return null; // Placeholder for example
};

const ProductPriceInput: DashboardInputComponent['component'] = ({ value, onChange, ...props }) => {
    // This would be a React component in practice
    return null; // Placeholder for example
};

// Example extension demonstrating field-specific input components
export const inputTargetingExample = defineDashboardExtension({
    customFormComponents: {
        inputs: [
            // Field-specific input component for product name
            {
                id: 'product-name-input',
                pageId: 'product-detail',
                blockId: 'main-form',
                field: 'name',
                component: ProductNameInput,
            },

            // Field-specific input component for product description
            {
                id: 'product-description-input',
                pageId: 'product-detail',
                blockId: 'main-form',
                field: 'description',
                component: ProductDescriptionInput,
            },

            // Field-specific input component for product price
            {
                id: 'product-price-input',
                pageId: 'product-detail',
                blockId: 'main-form',
                field: 'price',
                component: ProductPriceInput,
            },
        ],
    },
});

/**
 * How it works:
 *
 * 1. During registration, all three properties are required and used to generate the component key:
 *    - Key: 'product-detail_main-form_name' for the name field
 *    - Key: 'product-detail_main-form_description' for the description field
 *    - Key: 'product-detail_main-form_price' for the price field
 *
 * 2. During lookup in the detail page, the same helper function is used:
 *    - Key: generateInputComponentKey(pageId, blockId, fieldName)
 *    - This ensures consistency between registration and lookup
 *
 * 3. The component registry will find the exact match:
 *    - If 'product-detail_main-form_name' exists, it will be used for the name field
 *    - Otherwise, it falls back to default input components based on field type
 */
