import { ChildEntity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../../shared/shared-types';
import { Order } from '../order/order.entity';

import { Session } from './session.entity';

@ChildEntity()
export class AnonymousSession extends Session {
    constructor(input: DeepPartial<AnonymousSession>) {
        super(input);
    }
}
