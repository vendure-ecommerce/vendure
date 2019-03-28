import { DeepPartial } from '@vendure/common/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { Order } from '../order/order.entity';

import { Session } from './session.entity';

@ChildEntity()
export class AnonymousSession extends Session {
    constructor(input: DeepPartial<AnonymousSession>) {
        super(input);
    }
}
