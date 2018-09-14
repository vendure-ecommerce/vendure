import { VendureConfig } from '../vendure-config';

/**
 * A VendurePlugin is a means of configuring and/or extending the functionality of the Vendure server. In its simplest form,
 * a plugin simply modifies the VendureConfig object. Although such configuration can be directly supplied to the bootstrap
 * function, using a plugin allows one to abstract away a set of related configuration.
 *
 * Aditionally, the init() method can perform async work such as starting servers, making calls to 3rd party services, or any other
 * kind of task which may be called for.
 */
export interface VendurePlugin {
    /**
     * This method is called when the app bootstraps, and can modify the VendureConfig object and perform
     * other (potentially async) tasks needed.
     */
    init(config: Required<VendureConfig>): Required<VendureConfig> | Promise<Required<VendureConfig>>;
}
