import { VendorSelectionStrategy } from './vendor-selection-strategy';

export class DefaultVendorSelectionStrategy implements VendorSelectionStrategy {
    selectChannelIdForVendorOrder() {
        return undefined;
    }
}
