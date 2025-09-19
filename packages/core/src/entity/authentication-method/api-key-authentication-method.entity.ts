import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, Column } from 'typeorm';

import { AuthenticationMethod } from './authentication-method.entity';

/**
 * @description
 * This method is used when an API key is used to authenticate Vendure Users.
 *
 * @docsCategory entities
 * @docsPage AuthenticationMethod
 */
@ChildEntity()
export class ApiKeyAuthenticationMethod extends AuthenticationMethod {
    constructor(input: DeepPartial<ApiKeyAuthenticationMethod>) {
        super(input);
    }

    @Column({ unique: true })
    apiKey: string;
}
