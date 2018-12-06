import { ChildEntity, Column, Index, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { User } from '../user/user.entity';

import { Session } from './session.entity';

@ChildEntity()
export class AuthenticatedSession extends Session {
    constructor(input: DeepPartial<AuthenticatedSession>) {
        super(input);
    }

    @ManyToOne(type => User)
    user: User;
}
