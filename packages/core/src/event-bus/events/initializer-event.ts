import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired when vendure finished initializing its services inside the {@code InitializerService}
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.6.3
 */
export class InitializerEvent extends VendureEvent {
    constructor() {
        super();
    }
}
