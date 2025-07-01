import { BooleanDisplayBadge, BooleanDisplayCheckbox } from '@/components/data-display/boolean.js';
import { DateTime } from '@/components/data-display/date-time.js';
import { Money } from '@/components/data-display/money.js';
import { VendureImage } from '@/components/shared/vendure-image.js';
import { DataDisplayComponent } from '../component-registry/component-registry.js';
import { globalRegistry } from '../registry/global-registry.js';
import { DashboardDisplayComponent } from './extension-api-types.js';

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

export function addDisplayComponent({ id, component }: DashboardDisplayComponent) {
    const displayComponents = globalRegistry.get('displayComponents');
    if (displayComponents.has(id)) {
        // eslint-disable-next-line no-console
        console.warn(`Display component with id "${id}" is already registered and will be overwritten.`);
    }
    displayComponents.set(id, component);
}
