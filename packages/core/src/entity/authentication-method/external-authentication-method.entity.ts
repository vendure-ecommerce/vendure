import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, Column } from 'typeorm';

import { AuthenticationMethod } from './authentication-method.entity';

@ChildEntity()
export class ExternalAuthenticationMethod extends AuthenticationMethod {
    constructor(input: DeepPartial<ExternalAuthenticationMethod>) {
        super(input);
    }

    @Column()
    provider: string;

    @Column()
    externalIdentifier: string;

    @Column('simple-json')
    metadata: any;
}
