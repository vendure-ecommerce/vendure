import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { User } from '../../entity/user/user.entity';

export interface AuthenticationStrategy<Data = unknown> extends InjectableStrategy {
    readonly name: string;
    authenticate(ctx: RequestContext, data: Data): Promise<User | false>;
    deauthenticate(user: User): Promise<void>;
}
