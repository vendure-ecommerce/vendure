import { RequestContext } from '../api';

import { VendureEvent } from './vendure-event';

/**
 * @description
 * The base class for all entity events used by the EventBus system.
 *
 * @docsCategory events
 * */
export abstract class VendureEntityEvent<Entity, Input = any> extends VendureEvent {
    public readonly entity: Entity;
    public readonly type: 'created' | 'updated' | 'deleted';
    public readonly ctx?: RequestContext;
    public readonly input?: Input;

    protected constructor(
        entity: Entity,
        type: 'created' | 'updated' | 'deleted',
        ctx?: RequestContext,
        input?: Input,
    ) {
        super();
        this.entity = entity;
        this.type = type;
        this.ctx = ctx;
        this.input = input;
    }
}
