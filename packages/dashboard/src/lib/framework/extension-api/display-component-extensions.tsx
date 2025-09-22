import { BooleanDisplayBadge, BooleanDisplayCheckbox } from '@/vdb/components/data-display/boolean.js';
import { DateTime } from '@/vdb/components/data-display/date-time.js';
import { Money } from '@/vdb/components/data-display/money.js';
import { VendureImage } from '@/vdb/components/shared/vendure-image.js';
import { DataDisplayComponent } from '../component-registry/component-registry.js';
import { globalRegistry } from '../registry/global-registry.js';

globalRegistry.register('displayComponents', new Map<string, DataDisplayComponent>());

// Create component function for asset display
const AssetDisplay: DataDisplayComponent = ({ value }) => <VendureImage asset={value} preset="tiny" />;

// Register built-in display components
const displayComponents = globalRegistry.get('displayComponents');
displayComponents.set('vendure:booleanCheckbox', BooleanDisplayCheckbox);
displayComponents.set('vendure:booleanBadge', BooleanDisplayBadge);
displayComponents.set('vendure:dateTime', DateTime);
displayComponents.set('vendure:asset', AssetDisplay);
displayComponents.set('vendure:money', Money);

export function getDisplayComponent(id: string): DataDisplayComponent | undefined {
    return globalRegistry.get('displayComponents').get(id);
}

/**
 * @description
 * Generates a display component key based on the targeting properties.
 * Follows the existing pattern: pageId_blockId_fieldName
 */
export function generateDisplayComponentKey(pageId: string, blockId: string, field: string): string {
    return `${pageId}_${blockId}_${field}`;
}

export function addDisplayComponent({
    pageId,
    blockId,
    field,
    component,
}: {
    pageId: string;
    blockId: string;
    field: string;
    component: React.ComponentType<{ value: any; [key: string]: any }>;
}) {
    const displayComponents = globalRegistry.get('displayComponents');

    // Generate the key using the helper function
    const key = generateDisplayComponentKey(pageId, blockId, field);

    if (displayComponents.has(key)) {
        // eslint-disable-next-line no-console
        console.warn(`Display component with key "${key}" is already registered and will be overwritten.`);
    }
    displayComponents.set(key, component);
}
