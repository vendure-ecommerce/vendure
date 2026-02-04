import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired when vendure finished bootstrapping.
 * For the server and worker process, this happens after the welcome message is logged.
 *
 * Use this event to preload data into the cache or perform other startup logic that would otherwise
 * block the bootstrapping process and slow down server start time.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 3.4.4
 */
export class BootstrappedEvent extends VendureEvent {
    constructor() {
        super();
    }
}
