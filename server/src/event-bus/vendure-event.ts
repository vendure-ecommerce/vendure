/**
 * The base class for all events used by the EventBus system.
 */
export abstract class VendureEvent {
    public readonly createdAt = new Date();
    protected constructor() {}
}
